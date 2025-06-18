const Product = require("../model/productModel")
const Order = require("../model/orderModel")
const moment = require("moment")

exports.getProductSummary = async (req, res) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$clothingType",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    count: 1
                }
            },

        ])

        res.status(200).json({ summary })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getOrderTrends = async (req, res) => {
  try {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      return moment().subtract(i, "days").format("YYYY-MM-DD");
    }).reverse();

    const trendData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment().subtract(30, "days").startOf("day").toDate()
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          orders: "$count"
        }
      }
    ]);

    const trends = last7Days.map(date => {
      const match = trendData.find(entry => entry.date === date); 
      return {
        date,
        orders: match ? match.orders : 0
      };
    });

    res.status(200).json(trends);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

