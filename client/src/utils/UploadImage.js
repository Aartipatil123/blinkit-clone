import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"

const uploadImage = async (image) => {
  try {
    const formData = new FormData()
    formData.append("image", image)

    const response = await Axios({
      ...SummaryApi.uploadImage,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    return response.data

  } catch (error) {
    console.log("Upload Image Error:", error)
    return null
  }
}

export default uploadImage