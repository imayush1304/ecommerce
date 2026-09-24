import { Link } from "react-router-dom";
import { Check, Truck, ClipboardList, CreditCard } from "lucide-react";

export default function CheckoutSteps({ shipping, confirmOrder, payment }) {
    
    // Calculate progress state
    let step = 1;
    if (shipping) step = 1;
    if (confirmOrder) step = 2;
    if (payment) step = 3;

    return (
        <div className="checkout-stepper-container">
            <div className="checkout-stepper">
                {/* Step 1: Shipping */}
                <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                    <div className="step-circle">
                        {step > 1 ? <Check size={18} /> : <Truck size={18} />}
                    </div>
                    <div className="step-label">Shipping</div>
                </div>

                <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>

                {/* Step 2: Confirm Order */}
                <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                    <div className="step-circle">
                        {step > 2 ? <Check size={18} /> : <ClipboardList size={18} />}
                    </div>
                    <div className="step-label">Confirm</div>
                </div>

                <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>

                {/* Step 3: Payment */}
                <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-circle">
                        <CreditCard size={18} />
                    </div>
                    <div className="step-label">Payment</div>
                </div>
            </div>
        </div>
    )
}