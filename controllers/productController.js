const { resolve } = require("path");
const recordPerPage = require("../config/pagination");
const Product = require("../models/ProductModel");
const imageValidate = require("../utils/imageValidate");

const newProduct = async (req, res, next) => {
    const { name, description, category, stock, price, images, rating, reviewNumber, reviews, attrs } = req.body;
    // input field validationError
    if (!name || !description || !category || !stock || !price || !images, !rating || !reviewNumber || !reviews || !attrs) {
        res.status(400).json({
            message: "All input fields must be provided"
        })
    }
    // duplicate check
    const existingProduct = await Product.findOne({ name: name });
    if (existingProduct) {
        res.status(400).send("Product already exists")
    }

    try {
        const products = await Product.create({ name, description, category, stock, price, images, rating, reviewNumber, reviews, attrs })
        res.status(201).json({
            products
        })

    } catch (error) {
        next(error);
    }
}

const getProducts = async (req, res, next) => {
    try {
        // page number
        const { pageNum } = req.query || 1;



        //*********** */ sort by price/name ******
        let sortVal;
        const { sort } = req.query;
        // console.log(sort);
        if (sort) {
            var sortOption = sort.split("_")
            // console.log(sortOption);
            sortVal = { [sortOption[0]]: Number(sortOption[1]) };
            // console.log(sortVal);
        }
        // price range and rating filtering
        let priceQuery = {};
        let price = req.query.price;
        if (price) {
            priceQuery = { price: { $lte: Number(price) } }
            // console.log(priceQuery);
        }

        let ratingQuery = {};
        let rating = req.query.rating;
        // console.log(rating.split(','))
        if (rating) {
            ratingQuery = { rating: { $in: rating.split(',') } }
            // console.log(ratingQuery);
        }

        // search category in search bar
        let categoryQuery = {};
        const categoryName = req.params.categoryName;
        // console.log(categoryName);
        if (categoryName) {
            let a = categoryName.replaceAll(",", "/")
            var regEx = new RegExp("^" + a);
            categoryQuery = { category: regEx }
        }

        let categoryQuerySelect = {};
        let category = req.query.category;

        if (category) {
            categoryQuerySelect = { category: { $in: category.split(',') } }
            // console.log(categoryQuerySelect)

        }

        let attrsQuery = [];
        if (req.query.attrs) {
            // attrs=RAM-1TB-2TB-4TB,color-blue-red
            // [ 'RAM-1TB-4TB', 'color-blue', '' ]
            attrsQuery = req.query.attrs.split(",").reduce((acc, item) => {
                if (item) {
                    let a = item.split("-");
                    let values = [...a];
                    values.shift(); // removes first item
                    let a1 = {
                        attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
                    };
                    acc.push(a1);
                    // console.dir(acc, { depth: null })
                    return acc;
                } else return acc;
            }, []);
            //   console.dir(attrsQuery, { depth: null });

        }

        // search query
        let searchQueryText = {};
        let score;
        const searchQuery = req.params.searchQuery;
        if (searchQuery) {
            searchQueryText = { $text: { $search: '"' + searchQuery + '"' } }
            // show search score in db result
            score = { score: { $meta: "textScore" } }
            // sort results by score
            sortVal = { score: { $meta: "textScore" } }
        }

        let query;

        query = { $and: [priceQuery, ratingQuery, categoryQuery, categoryQuerySelect, ...attrsQuery, searchQueryText] }



        // total number of products
        const productCount = await Product.countDocuments(query);
        const products = await Product.find(query).skip(recordPerPage * (Number(pageNum) - 1)).sort(sortVal).select(score).populate("reviews");
        res.status(200).json({
            products,
            pageNum,
            productCount,
            paginationLinkNumber: Math.ceil(productCount / recordPerPage)
        })
    } catch (error) {
        next(error);
    }
}

const getProductsID = async (req, res, next) => {
    try {
        const productId = req.params.id;
        if (req.params.id) {
            const product = await Product.findById(productId).populate("reviews")
            res.status(200).json({
                product
            })
        }

    } catch (error) {
        next(error);
    }
}

const getBestSeller = async (req, res, next) => {
    const products = await Product.find({})
    console.log(products.length);
    let query;
    query = {
        sales: -1
    }
    let productTotal;
    try {

        if (products.length > 0) {
            const bestSeller = await Product.find({}).sort(query).limit(3)
            res.status(200).json({
                bestSeller,
                productTotal: bestSeller.length
            })
        }
        else {
            res.status(404).json({
                message: "No products found"
            })
        }
    } catch (error) {
        next(error);
    }

}

// admin controllers
const adminGetProducts = async (req, res, next) => {
    try {
        // console.log(req.user);
        const products = await Product.find({})
            .sort({ category: 1 })
            .select('name price category')
        res.status(200).json({
            products,
            productTotal: products.length
        })
    } catch (error) {
        next(error);
    }
}

const adminDeleteProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        await product.remove()
        res.status(200).json({
            message: 'Product removed successfully'
        })
    } catch (error) {
        next(error);
    }
}
const adminNewProduct = async (req, res, next) => {
    const { name, description, category, stock, price, attrs } = req.body;
    // input field validationError
    if (!name || !description || !category || !stock || !price || !attrs) {
        res.status(400).json({
            message: "All input fields must be provided"
        })
    }
    // duplicate check
    const existingProduct = await Product.findOne({ name: name });
    if (existingProduct) {
        res.status(400).send("Product already exists")
    }

    try {
        const products = await Product.create({ name, description, category, stock, price, attrs })
        res.status(201).json({
            message: "Product created successfully",
            id: products._id,
        })

    } catch (error) {
        next(error);
    }
}

const adminUpdateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        let product = await Product.findById(id);
        // console.log(product);

        const { name, description, category, stock, price, attrs } = req.body;
        // console.log(name, description, category, stock, price, attrs);
        if (name !== undefined) {
            product.name = name;
        }
        if (description !== undefined) {
            product.description = description;
        }
        if (category !== undefined) {
            product.category = category;
        }
        if (stock !== undefined) {
            product.stock = stock;
        }
        if (price !== undefined) {
            product.price = price;
        }
        if (attrs !== undefined) {
            product.attrs = [];
            attrs.map((item) => {
                // console.log(item);
                product.attrs.push(item);
            })
        }
        // // save to DB
        await product.save();

        res.status(200).json({
            message: "Product updated successfully"
        })
    } catch (error) {
        next(error);
    }
}

const adminUpload = async (req, res, next) => {
    let product = await Product.findById(req.query.productId);
    // console.log(product);
    try {
        if (!req.files || !req.files.images) {
            res.status(404).send("No images found for upload")
        }
        // image validation
        const validateResult = imageValidate(req.files.images)
        if (validateResult.error) {
            res.status(400).send(validateResult.error)
        }

        const path = require('path');
        // random string
        const { v4: uuidv4 } = require('uuid');
        // image path directory
        const uploadDirectory = path.resolve(__dirname, "../../frontend", "public", "imgs", "products");


        let imagesTable = [];

        if (req.files.images.length > 1) {
            imagesTable = req.files.images;
        }
        else if (req.files.images) {
            imagesTable.push(req.files.images);
        }
        // handle single image from array
        for (let image of imagesTable) {
            // console.log(image);
            // console.log(path.extname(image.name));
            var fileName = uuidv4() + path.extname(image.name)
            var uploadPath = uploadDirectory + '/' + fileName

            image.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err);
            })
            // push to db image
            product.images.push({ path: "/imgs/products/" + fileName })
        }
        // save image to db
        await product.save();
        return res.status(200).send("Files uploaded successfully")

    } catch (error) {
        next(error);
    }
}

const adminDeleteProductImage = async (req, res, next) => {
    try {
        const imagePath = decodeURIComponent(req.params.imagePath);

        const path = require('path');

        const finalPath = path.resolve("../frontend/public") + imagePath;


        const fs = require('fs');
        fs.unlink(finalPath, (err) => {
            if (err) {
                res.status(500).send(err)
            }
        })
        // console.log(finalPath);
        // remove url from DB
        await Product.findOneAndUpdate({ _id: req.params.productId }, { $pull: { images: { path: imagePath } } })

        return res.end()

    } catch (error) {
        next(error);
    }
}

module.exports = { getProducts, newProduct, getProductsID, getBestSeller, adminGetProducts, adminDeleteProducts, adminNewProduct, adminUpdateProduct, adminUpload, adminDeleteProductImage };