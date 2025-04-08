export const WishlistModal = ({ closeModal, handleDeleteWishlist }) => {
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
    openButton: {
      backgroundColor: "#007bff",
      color: "#fff",
      marginBottom: "10px",
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
    <div>
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <h2>Remove From Wishlist</h2>
          <p>Are you sure you want to Remove this item from wishlist ?</p>

          <div style={styles.buttonGroup}>
            <button
              onClick={closeModal}
              style={{ ...styles.button, ...styles.cancelButton }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteWishlist();
                closeModal();
              }}
              style={{ ...styles.button, ...styles.confirmButton }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
