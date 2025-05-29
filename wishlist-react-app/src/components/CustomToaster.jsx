import { Toaster } from "react-hot-toast";
import { X as Cross, Check } from "lucide-react";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          backgroundColor: "white",
          display: "flex",
          gap: "8px",
          background: "white",
          borderRadius: "10px",
          border: "1px solid #c9c9c9",
          padding: "8px 16px",
        },
        error: {
          icon: (
            <Cross
              style={{
                backgroundColor: "#ff4b4b",
                color: "white",
                borderRadius: "1000px",
                padding: "4px",
                strokeWidth: "3px",
                height: "22px",
                width: "22px",
              }}
              size="20px"
            />
          ),
        },
        success: {
          icon: (
            <Check
              style={{
                backgroundColor: "#62d346",
                color: "white",
                borderRadius: "1000px",
                padding: "4px",
                height: "22px",
                width: "22px",
              }}
              size="20px"
            />
          ),
        },
      }}
    />
  );
}
