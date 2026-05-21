import uploadImageClodinary from "../utils/uploadImageClodinary.js"

const uploadImageController = async (req, res) => {
  try {
    const file = req.file

    const uploadImage = await uploadImageClodinary(file)

    return res.json({
      message: "Upload done",
      data : uploadImage,
      success : true,
      error : false
    })

    /* Check file exists */
    if (!file) {
      return res.status(400).json({
        message: "Image file is required",
        error: true,
        success: false
      })
    }

    console.log("Uploaded File:", file)

    /* Success Response */
    return res.status(200).json({
      message: "Image uploaded successfully",
      data: file,
      error: false,
      success: true
    })

  } catch (error) {
    console.log("Upload Image Error:", error)

    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    })
  }
}

export default uploadImageController