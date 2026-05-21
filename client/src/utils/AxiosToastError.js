import toast from "react-hot-toast"
const AxiosToastError = (error) => {
    toast.error(
        error?.res?.data?.message
    )
}
export default AxiosToastError