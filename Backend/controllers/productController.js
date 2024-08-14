const Product = require("../model/product");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary")

//Create --- Admin
exports.createProduct = async (req, res) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    });
}

// Get all products
exports.getAllProducts = async (req, res) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    const apifeature = await new ApiFeatures(Product.find(), req.query).search().filter();
    let products = await apifeature.query;
    const filteredProducts = products.length;
    apifeature.pagination(resultPerPage);
    products = await apifeature.query;
    res.status(200).json({ products, productCount, resultPerPage, filteredProducts });
}

// Get all products -- Admin
exports.getAdminProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({ products });
}

// Update a product --- Admin
exports.updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(400).json({
            success: false,
            message: "Product not found"
        })
    }

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Delete images from cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }


        const imagesLinks = [];
        for (let i = 0; i < images?.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(
        {
            success: true,
            updatedProduct
        });
}

// Delete a product --- Admin
exports.deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(400).json({ message: "Product not found" })
    }
    // Deleting images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }


    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product removed"
    })
}

// Get product details
exports.getProductDetails = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(400).json({ message: "Product not found" })
    }
    res.status(200).json({ product });
}

// Create or Update Product review
exports.createProductReview = async (req, res) => {
    const { rating, comment, productId } = req.body;
    try {
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }
        const product = await Product.findById(productId);
        const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString()) (
                    rev.rating = rating,
                    rev.comment = comment
                )
            });

        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }
        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        product.ratings = avg / product.reviews.length;
        await product.save(
            { validateBeforeSave: false }
        );
        res.status(200).json({ success: true, message: "Review added" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//Get all reviews of a product
exports.getProductReviews = async (req, res) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return res.status(400).json({ success: true, message: "Product not found" })
    }
    res.status(200).json(product.reviews)
}

// Delete a review
exports.deleteReview = async (req, res) => {
    const { id, productId } = req.query;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(400).json({ message: "Product not found" })
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== id.toString());
    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0
    if (reviews.length === 0) {
        ratings = 0
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        message: "Review deleted"
    })
}
