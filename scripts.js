// Initialize Salesforce Interactions
SalesforceInteractions.init({
  cookieDomain: window.location.hostname,
  consents: [
    {
      provider: "OneTrust",
      purpose: "Tracking",
      status: SalesforceInteractions.ConsentStatus.OptIn
    }
  ]
}).then(() => {
  console.log("Salesforce Interactions initialized");
  initSitemap();
});

function initSitemap() {
  SalesforceInteractions.initSitemap({
    global: {
      listeners: [
        // Email form submit listener
        SalesforceInteractions.listener("submit", "form#emailForm", async () => {
          try {
            const email = SalesforceInteractions.cashDom("#email").val();

            await SalesforceInteractions.sendEvent({
              interaction: {
                name: "Email Capture Submit",
                eventType: "consent"
              },
              user: {
                attributes: {
                  email
                }
              }
            });

            console.log("Email capture event sent successfully");
            alert("Thank you! We have received your email.");
            document.getElementById("emailForm").reset();
          } catch (err) {
            console.error("Error sending email capture event", err);
          }
        }),

        // Cart form submit listener (optional)
        SalesforceInteractions.listener("submit", "form#cartForm", async () => {
          try {
            const item = document.querySelector("form#cartForm input")?.value;

            await SalesforceInteractions.sendEvent({
              interaction: { name: "Cart Checkout", eventType: "cart" },
              user: { attributes: { item } }
            });

            console.log("Cart event sent successfully");
            alert("Cart checkout event sent!");
          } catch (err) {
            console.error("Error sending cart event", err);
          }
        })
      ]
    },

    pageTypes: [
      {
        name: "Home Page",
        isMatch: () => window.location.pathname.includes("index"),
        interaction: { name: "Home Page View" }
      },
      {
        name: "Product Page",
        isMatch: () => window.location.pathname.includes("product"),
        interaction: {
          name: "View Product",
          catalogObject: {
            type: "Product",
            id: () =>
              document.querySelector("[data-product-id]")?.dataset.productId
          }
        }
      },
      {
        name: "Cart Page",
        isMatch: () => window.location.pathname.includes("cart"),
        interaction: { name: "Cart View" }
      },
      {
        name: "Email Capture Page",
        isMatch: () => window.location.pathname.includes("email.html"),
        interaction: { name: "Email Capture View" }
      }
    ]
  });
}
