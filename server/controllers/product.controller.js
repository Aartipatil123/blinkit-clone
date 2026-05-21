import ProductModel from "../models/product.model.js";

export const createProductController = async (req, res) => {

    try {

        const {
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = req.body;

        // =========================
        // VALIDATION
        // =========================
        if (
            !name?.trim() ||
            !image ||
            image.length === 0 ||
            !category ||
            category.length === 0 ||
            !subCategory ||
            subCategory.length === 0 ||
            !unit?.trim() ||
            !price ||
            !description?.trim()
        ) {
            return res.status(400).json({
                message: "Enter all required fields",
                error: true,
                success: false
            });
        }

        // =========================
        // CREATE PRODUCT
        // =========================
        const product = new ProductModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock: stock || 0,
            price,
            discount: discount || 0,
            description,
            more_details
        });

        // =========================
        // SAVE PRODUCT
        // =========================
        const saveProduct = await product.save();

        return res.status(201).json({
            message: "Product Created Successfully",
            data: saveProduct,
            error: false,
            success: true
        });

    } catch (error) {

        console.log("Create Product Error :", error);

        return res.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
};

export const getProductController = async(req, res)=>{
    try{
        let { page, limit, search } = req.body;

        // ================= DEFAULT VALUES =================
        page = Number(page) || 1;
        limit = Number(limit) || 10;

        // ================= SEARCH QUERY =================
        const query = search
            ? {
                $text: {
                    $search: search
                }
            }
            : {};

        // ================= PAGINATION =================
        const skip = (page - 1) * limit;

        // ================= FETCH DATA =================
        const [data, totalCount] = await Promise.all([

            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("category")
                .populate("subCategory"),

            ProductModel.countDocuments(query)

        ]);

        // ================= RESPONSE =================
        return res.status(200).json({
            message: "Product data fetched successfully",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            currentPage: page,
            data: data
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
};

export const getProductByCategory = async (req, res) => {

    try {

        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                message: "Provide category id",
                error: true,
                success: false
            })
        }

        const product = await ProductModel.find({
            category: {
                $in: [id]   // ✅ FIXED
            }
        }).limit(15)

        return res.json({
            message: "Category product list",
            data: product,
            error: false,
            success: true
        })

    } catch (error) {

        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}