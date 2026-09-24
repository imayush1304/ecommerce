import { Link } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
    return (
        <div className="os-container">
            <MetaData title={'Order Placed Successfully'} />
            
            <div className="os-card">
                <div className="os-icon-wrapper">
                    <CheckCircle size={80} color="#059669" />
                </div>
                
                <h1 className="os-title">Order Placed Successfully!</h1>
                <p className="os-desc">
                    Thank you for your purchase. We've received your order and are getting it ready for shipment. 
                    You'll receive an email confirmation shortly.
                </p>

                <div className="os-actions">
                    <Link to="/orders" className="da-btn da-btn-primary">
                        View My Orders <ArrowRight size={20} />
                    </Link>
                    <Link to="/" className="da-btn da-btn-outline">
                        <ShoppingBag size={20} /> Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}