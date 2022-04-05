import moment from "moment";
import { Review } from "../../models/Review";
import "./ProductReview.scss";

interface Props {
  review: Review;
}

const ProductReview = ({ review }: Props) => {
  return (
    <div className="product__review">
      <h3 className="product__review-name">{review.name}</h3>
      <h4 className="product__review-date">
        {moment(review.reviewedDate, "DD MM YYYY").format("LL")}
      </h4>
      <h4 className="product__review-rating">
        {new Array(review.rating).fill(null).map((_, index) => (
          <span key={index}>&#9733;</span>
        ))}
      </h4>

      <p className="product__review-review">{review.review}</p>
    </div>
  );
};

export default ProductReview;
