import CategoryModel from "../models/category.model.js"
import SubCategoryModel from "../models/subCategory.model.js"
import ProductModel from "../models/product.model.js" // ✅ missing import fixed


// ==============================
// Add Category
// ==============================
export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body

    // Validation
    if (!name || !image) {
      return res.status(400).json({
        message: "Please enter required fields",
        error: true,
        success: false
      })
    }

    // Check existing category
    const existingCategory = await CategoryModel.findOne({ name })

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
        error: true,
        success: false
      })
    }

    // Create new category
    const addCategory = new CategoryModel({
      name,
      image
    })

    // Save category
    const saveCategory = await addCategory.save()

    if (!saveCategory) {
      return res.status(500).json({
        message: "Category not created",
        error: true,
        success: false
      })
    }

    return res.status(201).json({
      message: "Category added successfully",
      data: saveCategory,
      success: true,
      error: false
    })

  } catch (error) {
    console.log("Add Category Error:", error)

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    })
  }
}


// ==============================
// Get Category
// ==============================
export const getCategoryController = async (req, res) => {
  try {
    const data = await CategoryModel.find().sort({ createdAt : -1})

    return res.json({
      data: data,
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


// ==============================
// Update Category
// ==============================
export const updateCategoryController = async (req, res) => {
  try {
    const { categoryId, name, image } = req.body

    console.log("REQ BODY :", req.body)

    // Validation
    if (!categoryId || !name || !image) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false
      })
    }

    const updateCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        name,
        image
      },
      {
        new: true
      }
    )

    if (!updateCategory) {
      return res.status(404).json({
        message: "Category not found",
        error: true,
        success: false
      })
    }

    return res.json({
      message: "Updated Successfully",
      success: true,
      error: false,
      data: updateCategory
    })

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    })
  }
}


// ==============================
// Delete Category
// ==============================
export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.body

    // Validation
    if (!_id) {
      return res.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false
      })
    }

    // Check SubCategory
    const checkSubCategory = await SubCategoryModel.find({
      category: {
        $in: [_id]
      }
    }).countDocuments()

    // Check Product
    const checkProduct = await ProductModel.find({
      category: {
        $in: [_id]
      }
    }).countDocuments()

    // Prevent delete if linked
    if (checkSubCategory > 0 || checkProduct > 0) {
      return res.status(400).json({
        message: "Category is already in use, can't delete",
        error: true,
        success: false
      })
    }

    // Delete category
    const deleteCategory = await CategoryModel.deleteOne({
      _id: _id
    })

    return res.json({
      message: "Category deleted successfully",
      data: deleteCategory,
      error: false,
      success: true
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true
    })
  }
}