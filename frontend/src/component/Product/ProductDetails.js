import React, { useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../actions/productActions.js';
import './ProductDetails.css';
import ReviewCard from './ReviewCard.js'
import Loader from '../layout/Loader/Loader.js';
import MetaData from '../layout/MetaData.js';
import { addToCart } from '../../actions/cartActions.js';
import { useAlert } from 'react-alert';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from "@material-ui/core"
import { Rating } from '@material-ui/lab';
import { NEW_REVIEW_RESET } from '../../constants/productConstants.js';


const ProductDetails = ({ match }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { product, loading , error} = useSelector(state => state.productDetails)
    const { success, error : reviewError } = useSelector(state => state.newReview)
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const submitReviewToggle = () => {
        setOpen(!open);
    }
    const handleSubmit  = () => {
        const myreview = new FormData();
        myreview.set("rating", rating)
        myreview.set("comment", comment)
        myreview.set("productId", product._id)
        dispatch(newReview(myreview));
        setOpen(false);
    }

    const increaseQty = () => {
        if (product.stock <= quantity) return;
        const qty = quantity + 1;
        setQuantity(qty)
    }
    const decreaseQty = () => {
        if (quantity <= 1) return;
        const qty = quantity - 1;
        setQuantity(qty)
    }
    const addToCartHandler = () => {
        dispatch(addToCart(match.params.id, quantity));
        alert.success('Item added to cart');
    }

    const options = {
        size : "large",
        value: product.ratings,
        readOnly : true,
        precision: 0.5
    }
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Review Submitted SuccessFully");
            dispatch(
                {type : NEW_REVIEW_RESET}
            );
        }
        dispatch(getProductDetails(match.params.id))
    }, [dispatch, match.params.id, success, alert, error, reviewError])
    return (
        <>
            {loading ? <Loader /> :
                <>
          <MetaData title={`${product.name} --- ECOMMERCE`}/>
                    <div className='ProductDetails'>
                        <div>
                            <Carousel>
                                {product.images && product.images.map((item, i) => (
                                    <img className='CarouselImage' key={i} src={item.url} alt={`Slide ${i}`} />
                                ))}
                            </Carousel>
                        </div>
                        <div>
                            <div className='detailsBlock-1'>
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className='detailsBlock-2'>
                                <Rating {...options} />
                                <span>({product.numOfReviews} Reviews)</span>
                            </div>
                            <div className='detailsBlock-3'>
                                <h1>₹{product.price}</h1>
                                <div className='detailsBlock-3-1'>
                                    <div className='detailsBlock-3-1-1'>
                                        <button onClick={decreaseQty}>-</button>
                                        <input readOnly type='number' value={quantity} />
                                        <button onClick={increaseQty}>+</button>
                                    </div>
                                    <button disabled={product.stock < 1 ? true:false} onClick={addToCartHandler}>Add to Cart</button>
                                </div>
                                <p>
                                    Status :
                                    <b className={product.stock < 1 ? 'redColor' : 'greenColor'}>
                                        {product.stock < 1 ? 'OutOfStock' : 'InStock'}
                                    </b>
                                </p>
                            </div>
                            <div className='detailsBlock-4'>
                                Description : <p>{product.description}</p>
                            </div>
                            <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                        </div>
                    </div>
                    <h3 className='reviewsHeading'>REVIEWS</h3>
                    <Dialog
                    aria-labelledby="simple-dialog-title"
                    open = {open}
                    onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className='submitDialog'>
                                <Rating
                                onChange={(e)=> setRating(e.target.value)}
                                value={rating}
                                size='large'
                                />
                                <textarea
                                className='submitDialogTextArea'
                                rows= "5"
                                cols="30"
                                value={comment}
                                onChange={(e)=> setComment(e.target.value)}
                                >
                                </textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button color='secondary' onClick={submitReviewToggle}>Cancel</Button>
                            <Button onClick={handleSubmit} color='primary' > Submit </Button>
                        </DialogActions>
                    </Dialog>
                    {product.reviews && product.reviews[0] ? (
                        <div className='reviews'>
                            {product.reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
                        </div>
                    ) : (
                        <div className='noReviews'>No Reviews Yet</div>
                    )}
                </>
            }
        </>
    )
}

export default ProductDetails
