import SubCategoryModel from '../models/subCategory.model.js'

// ================= ADD =================
export const AddSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body

    if (!name || !image || !category || category.length === 0) {
      return res.status(400).json({
        message: "Provide name, image, category",
        error: true,
        success: false
      })
    }

    const payload = {
      name,
      image,
      category
    }

    const createSubCategory = new SubCategoryModel(payload)
    const save = await createSubCategory.save()

    return res.status(201).json({
      message: "Sub Category Created",
      data: save,
      error: false,
      success: true
    })

  } catch (error) {
    console.log("Add SubCategory Error:", error)   // ✅ debug log
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// ================= GET =================
export const getSubCategoryController = async (req, res) => {
  try {

    const data = await SubCategoryModel
      .find()
      .sort({ createdAt: -1 })   // ✅ FIX (important)
      .populate('category')      // ✅ category details

    return res.json({
      message: "Sub Category data",
      data: data,
      error: false,
      success: true
    })

  } catch (error) {
    console.log("Get SubCategory Error:", error)   // ✅ debug log
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export const updateSubCategoryController = async (req, res) => {
  try {
    const { _id, name, image, category } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "SubCategory ID required",
        error: true,
        success: false
      });
    }

    const checkSub = await SubCategoryModel.findById(_id);

    if (!checkSub) {
      return res.status(404).json({
        message: "SubCategory not found",
        error: true,
        success: false
      });
    }

    // ✅ FIX: UPDATE instead of DELETE
    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
      _id,
      {
        name,
        image,
        category
      },
      { new: true } // ✅ updated data return karega
    );

    return res.json({
      message: "Sub Category Updated Successfully",
      data: updatedSubCategory,
      error: false,
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};

export const deleteSubCategoryController = async(req, res) =>{
  try{
    const { _id } = req.body

    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

    return res.json({
      message : "Delete Successfully",
      data : deleteSub,
      error : false,
      success : true
    })
  }
  catch(error){
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}