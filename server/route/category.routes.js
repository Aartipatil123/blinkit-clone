import { Router } from 'express'
import auth from '../middleware/auth.js'
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controllers/category.controller.js'

const categoryRaouter = Router()

categoryRaouter.post("/add-category",auth,AddCategoryController)
categoryRaouter.get('/get',getCategoryController)
categoryRaouter.put('/update',auth,updateCategoryController)
categoryRaouter.delete("/delete",auth,deleteCategoryController)


export default categoryRaouter