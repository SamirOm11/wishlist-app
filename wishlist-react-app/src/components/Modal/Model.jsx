import React from "react";

export const WishlistModal = ({
  closeModal,
  handleConfirm,
  message = "Are you sure you want to remove this item from wishlist?",
  title,
  confirmLabel = "Remove",
}) => {
  console.log("handleDeleteWishlist", handleConfirm);
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "#fff",
      padding: "20px 30px",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "400px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    },
    button: {
      padding: "10px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    },
    cancelButton: {
      backgroundColor: "#ccc",
      marginRight: "10px",
    },
    confirmButton: {
      backgroundColor: "#28a745",
      color: "#fff",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={styles.buttonGroup}>
          <button
            onClick={closeModal}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{ ...styles.button, ...styles.confirmButton }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
