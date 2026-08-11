import React, { useState } from "react";
import "./Subscription.css";

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const plans = [
    {
      id: 1,
      name: "Free",
      price: "₹0",
      period: "/month",
      description: "Perfect for getting started",
      icon: "🆓",
      features: [
        "20 AI messages",
        "Basic AI access",
        "Chat history",
        "Standard support",
      ],
    },

    {
      id: 2,
      name: "Basic",
      price: "₹199",
      period: "/month",
      description: "For regular AI users",
      icon: "🚀",
      features: [
        "500 AI messages",
        "Faster AI responses",
        "Unlimited chat history",
        "Priority support",
      ],
    },

    {
      id: 3,
      name: "Pro",
      price: "₹499",
      period: "/month",
      description: "For professional users",
      icon: "⭐",
      popular: true,
      features: [
        "Unlimited AI messages",
        "Advanced AI models",
        "File uploads",
        "Image generation",
        "Priority support",
      ],
    },

    {
      id: 4,
      name: "Premium",
      price: "₹999",
      period: "/month",
      description: "Complete AI experience",
      icon: "👑",
      features: [
        "Everything in Pro",
        "Premium AI models",
        "Unlimited file uploads",
        "Advanced image generation",
        "24/7 premium support",
      ],
    },
  ];

  // =========================================
  // SUBSCRIBE
  // =========================================

  const handleSubscribe = (plan) => {
    if (plan.name === "Free") {
      alert("You are already using the Free Plan.");
      return;
    }

    setSelectedPlan(plan);
    setPaymentMethod("card");
  };

  // =========================================
  // CLOSE PAYMENT
  // =========================================

  const closePayment = () => {
    setSelectedPlan(null);
    setPaymentMethod("card");
  };

  // =========================================
  // PAYMENT
  // =========================================

  const handlePayment = (e) => {
    e.preventDefault();

    if (!selectedPlan) {
      return;
    }

    alert(
      `Payment initiated for ${selectedPlan.name} Plan - ${selectedPlan.price}/month`
    );

    closePayment();
  };

  return (
    <div className="subscription-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="subscription-header">

        <div className="subscription-title-area">

          <div className="subscription-main-icon">
            💳
          </div>

          <div>
            <h1>Choose Your Plan</h1>

            <p>
              Upgrade your Nova AI experience
              with a plan that fits you.
            </p>
          </div>

        </div>

      </div>

      {/* =====================================
          PLANS
      ===================================== */}

      <div className="plans-grid">

        {plans.map((plan) => (

          <div
            className={`plan-card ${
              plan.popular ? "popular-plan" : ""
            }`}
            key={plan.id}
          >

            {/* POPULAR BADGE */}

            {plan.popular && (
              <div className="popular-badge">
                ⭐ MOST POPULAR
              </div>
            )}

            {/* PLAN ICON */}

            <div className="plan-icon">
              {plan.icon}
            </div>

            {/* PLAN NAME */}

            <h2>
              {plan.name}
            </h2>

            {/* DESCRIPTION */}

            <p className="plan-description">
              {plan.description}
            </p>

            {/* PRICE */}

            <div className="plan-price">

              <span>
                {plan.price}
              </span>

              <small>
                {plan.period}
              </small>

            </div>

            {/* FEATURES */}

            <div className="features">

              {plan.features.map(
                (feature, index) => (

                  <div
                    className="feature"
                    key={index}
                  >

                    <span className="check-icon">
                      ✓
                    </span>

                    <span>
                      {feature}
                    </span>

                  </div>

                )
              )}

            </div>

            {/* BUTTON */}

            <button
              type="button"
              className={`subscribe-btn ${
                plan.popular
                  ? "popular-button"
                  : ""
              }`}
              onClick={() =>
                handleSubscribe(plan)
              }
            >

              {plan.name === "Free"
                ? "Current Plan"
                : "Subscribe"}

            </button>

          </div>

        ))}

      </div>

      {/* =====================================
          PAYMENT MODAL
      ===================================== */}

      {selectedPlan && (

        <div className="payment-overlay">

          <div className="payment-modal">

            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="close-payment"
              onClick={closePayment}
            >
              ×
            </button>

            {/* PAYMENT HEADER */}

            <div className="payment-header">

              <div className="payment-modal-icon">
                💳
              </div>

              <h2>
                Subscribe to{" "}
                {selectedPlan.name}
              </h2>

              <p>
                Total:
                <strong>
                  {" "}
                  {selectedPlan.price}/month
                </strong>
              </p>

            </div>

            {/* =================================
                PAYMENT METHODS
            ================================= */}

            <div className="payment-methods">

              <button
                type="button"
                className={`method ${
                  paymentMethod === "card"
                    ? "active-method"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod("card")
                }
              >
                💳
                <span>Card</span>
              </button>

              <button
                type="button"
                className={`method ${
                  paymentMethod === "upi"
                    ? "active-method"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod("upi")
                }
              >
                📱
                <span>UPI</span>
              </button>

            </div>

            {/* =================================
                PAYMENT FORM
            ================================= */}

            <form onSubmit={handlePayment}>

              {/* NAME */}

              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                required
              />

              {/* CARD */}

              {paymentMethod === "card" && (
                <>

                  <label>
                    Card Number
                  </label>

                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />

                  <div className="card-row">

                    <div className="card-field">

                      <label>
                        Expiry Date
                      </label>

                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />

                    </div>

                    <div className="card-field">

                      <label>
                        CVV
                      </label>

                      <input
                        type="password"
                        placeholder="123"
                        maxLength="3"
                        required
                      />

                    </div>

                  </div>

                </>
              )}

              {/* UPI */}

              {paymentMethod === "upi" && (
                <>

                  <label>
                    UPI ID
                  </label>

                  <input
                    type="text"
                    placeholder="yourname@upi"
                    required
                  />

                  <div className="upi-example">
                    Example: username@upi
                  </div>

                </>
              )}

              {/* AMOUNT */}

              <div className="amount-box">

                <span>
                  Amount to Pay
                </span>

                <strong>
                  {selectedPlan.price}
                </strong>

              </div>

              {/* PAY BUTTON */}

              <button
                type="submit"
                className="pay-button"
              >
                🔒 Pay {selectedPlan.price}
              </button>

            </form>

            <div className="secure-payment">
              🔐 Secure payment information
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Subscription;
