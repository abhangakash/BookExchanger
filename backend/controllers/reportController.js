const Order = require("../models/Order");
const Book = require("../models/Book");
const mongoose = require("mongoose");


exports.getSalesReport = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { range } = req.query;
        let dateFilter = {};
        const now = new Date();

        // ✅ Adjust date filter based on selected range
        if (range === "daily") {
            dateFilter = { createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) } };
        } else if (range === "weekly") {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - 6); // Last 7 days
            dateFilter = { createdAt: { $gte: weekStart } };
        } else if (range === "monthly") {
            dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
        } else if (range === "yearly") {
            dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
        }

        // ✅ Fetch delivered orders only
        const orders = await Order.find({ seller: sellerId, ...dateFilter, status: "Delivered" });

        if (orders.length === 0) {
            return res.json({ labels: [], salesData: [] }); // Ensure empty response is structured
        }

        let salesData = {};
        let labels = [];

        if (range === "daily") {
            orders.forEach(order => {
                const hour = new Date(order.createdAt).getHours();
                salesData[hour] = (salesData[hour] || 0) + order.price;
            });
            labels = Array.from({ length: 24 }, (_, i) => `${i}:00`); // 24-hour format
        } else if (range === "weekly") {
            orders.forEach(order => {
                const day = new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "short" });
                salesData[day] = (salesData[day] || 0) + order.price;
            });
            labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        } else if (range === "monthly") {
            let daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            orders.forEach(order => {
                const day = new Date(order.createdAt).getDate();
                salesData[day] = (salesData[day] || 0) + order.price;
            });
            labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
        } else if (range === "yearly") {
            orders.forEach(order => {
                const month = new Date(order.createdAt).getMonth();
                salesData[month] = (salesData[month] || 0) + order.price;
            });
            labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }

        res.json({ labels, salesData: labels.map(label => salesData[label] || 0) });
    } catch (error) {
        console.error("❌ Error fetching sales report:", error);
        res.status(500).json({ message: "Error fetching sales report", error });
    }
};





// ✅ Aggregate orders to find best-selling books
exports.getBestSellingBooks = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const bestSellingBooks = await Order.aggregate([
            { $match: { seller: new mongoose.Types.ObjectId(sellerId), status: "Delivered" } },
            {
                $group: {
                    _id: "$book",
                    sales: { $sum: 1 },
                    revenue: { $sum: "$price" }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { $unwind: "$bookDetails" },
            {
                $project: {
                    title: "$bookDetails.title",
                    sales: 1,
                    revenue: 1
                }
            }
        ]);

        res.json(bestSellingBooks);
    } catch (error) {
        console.error("❌ Error fetching best-selling books:", error);
        res.status(500).json({ message: "Error fetching best-selling books", error });
    }
};



exports.getOrderSummary = async (req, res) => {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id); // ✅ Ensure ObjectId format
        const { range } = req.query;
        let dateFilter = {};
        const now = new Date();

        if (range === "daily") {
            const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // Midnight
            const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // End of the day
            dateFilter = { createdAt: { $gte: startOfDay, $lt: endOfDay } }; // ✅ Ensure correct daily range
        } else if (range === "weekly") {
            const weekStart = new Date();
            weekStart.setDate(now.getDate() - 6); // Last 7 days
            dateFilter = { createdAt: { $gte: weekStart } };
        } else if (range === "monthly") {
            dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
        } else if (range === "yearly") {
            dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
        }

        console.log("🟢 Seller ID:", sellerId);
        console.log("📆 Date Filter:", JSON.stringify(dateFilter, null, 2));

        // ✅ Fix ID Matching & Date Filtering
        const orders = await Order.aggregate([
            { $match: { seller: sellerId, ...dateFilter } }, // ✅ Filter by seller & date
            { 
                $group: { 
                    _id: "$status", 
                    count: { $sum: 1 } 
                } 
            }
        ]);

        console.log("📦 Orders Found:", orders);

        // ✅ Initialize response structure
        let summary = { completed: 0, pending: 0, cancelled: 0 };

        // ✅ Ensure correct mapping of statuses
        orders.forEach(order => {
            if (order._id === "Delivered") summary.completed = order.count;
            if (order._id === "Pending" || order._id === "Shipped" || order._id === "Accepted") summary.pending += order.count;
            if (order._id === "Cancelled") summary.cancelled = order.count;
        });

        console.log("📊 Order Summary Response:", summary);

        res.json(summary);
    } catch (error) {
        console.error("❌ Error fetching order summary:", error);
        res.status(500).json({ message: "Error fetching order summary", error });
    }
};
