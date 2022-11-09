const Category = require("../models/CategoryModel");
const { set } = require("../routes/apiRoutes");

const getCategories = async (req, res, next) => {

    try {
        const categories = await Category.find({}).sort({ "name": 1 })
        res.status(200).send(categories);

    } catch (error) {
        next(error)
    }
}

const newCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        if (!category) {
            res.status(400).send("Category input is required");
        }
        const existCategory = await Category.findOne({ name: category });
        if (existCategory) {
            res.status(400).send("Category already exists")
        }
        else {
            const newCategory = await Category.create({ name: category });
            res.status(201).send(newCategory)
        }
    } catch (error) {
        next(error);
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        console.log(category);
        if (category !== "Select Category") {
            const getRealCategory = category.split('/')[0]
            // console.log(getRealCategory);
            const getCategory = await Category.findOne({ name: getRealCategory })

            await getCategory.remove();
            res.status(200).send(getCategory.name + " " + "removed")
        }

    } catch (error) {
        next(error);
    }
}

const attrSave = async (req, res, next) => {
    const { key, val, categoryChosen } = req.body;
    if (!key || !val || !categoryChosen) {
        res.status(404).send("All input fields are required")
    }
    try {
        const category = categoryChosen.split("/")[0];
        // console.log(category);
        const categoryExists = await Category.findOne({ name: category });
        if (!categoryExists) {
            res.status(404).send("Category does not exist");
        }
        // console.log(categoryExists);
        //if category HasMore Than Zero Length
        if (categoryExists.attrs.length > 0) {

            var keyDoesNotExistsInDatabase = true

            categoryExists.attrs.map((item, idx) => {
                if (item.key === key) {
                    keyDoesNotExistsInDatabase = false
                    let attrVal = [...categoryExists.attrs[idx].value]
                    attrVal.push(val)
                    let uniqueAttrVal = [...new Set(attrVal)]
                    categoryExists.attrs[idx].value = uniqueAttrVal;
                }
            })

            if (keyDoesNotExistsInDatabase) {
                categoryExists.attrs.push({
                    key: key,
                    value: [val]
                })
            }

        }
        else {
            categoryExists.attrs.push({
                key: key,
                value: [val]
            })
        }

        await categoryExists.save();
        res.status(201).send("New attributes added successfully")

    } catch (error) {
        next(error);
    }
}

module.exports = { getCategories, newCategory, deleteCategory, attrSave };