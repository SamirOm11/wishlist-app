import {
  Divider,
  Banner,
  EmptyState,
  BlockStack,
  Text,
  Card,
  Button,
} from "@shopify/polaris";
import { Link } from "@remix-run/react";
import TopProductsSkeleton from "../components/TopProductsSkeleton";
import { ExternalIcon, PersonIcon, ImageIcon } from "@shopify/polaris-icons";
// import DateRangePicker from "../components/DateRangePicker";
import { useEffect, useState } from "react";
import { getDashboardData } from "../actions/getDashboardData";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });

  const [themeData, setThemeData] = useState();
  const [dashboardData, setDashboardData] = useState({
    totalWishlistAdditions: 0,
    totalProductsAddedToCart: 0,
    totalProductsAddedToWishlist: 0,
    totalCustomers: 0,
    totalAnonymousCustomers: 0,
    topProductsSFL: [],
    topCustomersSFL: [],
    topCustomers: [],
    topProducts: [],
  });

  const cards = [
    {
      title: "Wishlist additions",
      value: dashboardData.totalWishlistAdditions,
      action: { text: "View activities", link: "/app/activity" },
    },
    {
      title: "Customers",
      value: dashboardData.totalCustomers,
      action: { text: "View customers", link: "/app/customers" },
    },
    {
      title: "Anonymous customers",
      value: dashboardData.totalAnonymousCustomers,
      action: { text: "View customers", link: "/app/customers" },
    },
    {
      title: "Products added to wishlist",
      value: dashboardData.totalProductsAddedToWishlist,
      action: { text: "View products", link: "/app/products" },
    },
    {
      title: "Products added to cart",
      value: dashboardData.totalProductsAddedToCart,
      action: { text: "View activities", link: "/app/activity" },
    },
  ];

  const themeEditorButton = ({
    buttonText,
    appEmbedId,
    activeThemeId,
    shop,
  }) => (
    <Link
      to={`https://admin.shopify.com/store/${shop.myshopify_domain.replace(".myshopify.com", "")}/themes/${activeThemeId}/editor?context=apps&activateAppId=${appEmbedId}/Wishlist`}
      target="_blank"
      className="w-fit"
    >
      <Button icon={ExternalIcon} variant="primary">
        {buttonText}
      </Button>
    </Link>
  );

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // async function fetchData() {
  //   setIsLoading(true);
  //   const { data, error } = await getDashboardData({
  //     startDate: dateRange.start?.toISOString(),
  //     endDate: dateRange.end?.toISOString(),
  //   });
  //   if (error) {
  //     if (error.response?.status === 500)
  //       shopify.toast("Server Error", { isError: true });
  //     else
  //       shopify.toast.show("Oops! Something went wrong. Please try again", {
  //         isError: true,
  //       });
  //   } else {
  //     setDashboardData(data);
  //   }
  //   setIsLoading(false);
  // }

  async function fetchData() {
    try {
      const response = await fetch("/api/analytics");
      const result = await response.json();
      console.log("🚀 ~ fetchData ~ result:", result);
      if (result) {
        console.log("data successfully found");
        setDashboardData(result);
      }
    } catch (error) {
      console.log("error in fetching data", error);
    }
  }

  async function fetchExtensionIsEnabled() {
    try {
      const res = await fetch("/api/theme");
      const data = await res.json();
      if (res.ok) setThemeData(data);
      else if (res.status === 500)
        shopify.toast.show("Internal Server Error.", { isError: true });
      else if (res.status >= 400)
        shopify.toast.show("Something went wrong", {
          isError: true,
        });
    } catch (error) {
      console.log(error, "error");
      shopify.toast.show("Oops! Something went wrong", { isError: true });
    }
  }

  useEffect(() => {
    fetchExtensionIsEnabled();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "2rem 5rem",
        gap: "2rem",
      }}
    >
      {themeData?.themeExtensionDisabled && (
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ margin: "0 auto", maxWidth: "1024px" }}>
            <Banner title="Enable Theme Extension" tone="warning">
              <p style={{ marginBottom: "1rem" }}>
                Please enable the theme extension in the theme editor to ensure
                the app functions correctly.
              </p>
              {themeEditorButton({
                buttonText: "Enable theme extension",
                activeThemeId: themeData.activeThemeId,
                appEmbedId: themeData.appEmbedId,
                shop: themeData.shop,
              })}
            </Banner>
          </div>
        </div>
      )}
      <Text variant="headingLg">Dashboard</Text>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "1rem",
          mdGridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          lgGridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          xlDisplay: "flex",
          xlAlignItems: "center",
          xlFlexWrap: "nowrap",
          xlGap: "1rem",
        }}
      >
        {cards.map((card, i) => (
          <div style={{ width: "100%", height: "100%" }} key={i}>
            <Card>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  minWidth: "14rem",
                }}
              >
                <Text variant="headingMd">{card.title}</Text>
                <div style={{ padding: "1rem 0" }}>
                  {isLoading ? (
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        backgroundColor: "#d1d5db",
                        animation: "pulse 1s infinite",
                        borderRadius: "0.375rem",
                      }}
                    ></div>
                  ) : (
                    <Text variant="headingLg">{card.value}</Text>
                  )}
                </div>
                <Link
                  style={{
                    visibility: card.action ? "visible" : "hidden",
                    width: "fit-content",
                  }}
                  to={card.action ? card.action.link : ""}
                >
                  <Button>{card.action ? card.action.text : ""}</Button>
                </Link>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "2rem",
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "15rem",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <Text variant="headingMd">
                Top products by wishlist additions
              </Text>
            </div>
            {isLoading ? (
              <TopProductsSkeleton />
            ) : dashboardData.topProducts.length ? (
              dashboardData.topProducts.map((product, i) => (
                <BlockStack key={i}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {product.imageUrl ? (
                        <img
                          style={{ marginRight: "1rem", maxWidth: "2.5rem" }}
                          src={product.imageUrl}
                          alt=""
                        />
                      ) : (
                        <span
                          style={{ fontSize: "1.5rem", marginRight: "1rem" }}
                        >
                          <ImageIcon />
                        </span>
                      )}
                      <Link
                        to={product.url}
                        target="_blank"
                        style={{ textDecoration: "underline" }}
                      >
                        <Text>{product.name}</Text>
                      </Link>
                    </div>
                    <span style={{ paddingRight: "1rem" }}>
                      <Text>{product.additions}</Text>
                    </span>
                  </div>
                  {i < dashboardData.topProducts.length - 1 ? (
                    <Divider borderColor="border" />
                  ) : null}
                </BlockStack>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EmptyState
                  heading="No products added to Wishlist yet."
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                />
              </div>
            )}
          </div>
        </Card>
      </div> */}
    </div>
  );
}
