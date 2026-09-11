import { useMemo, useState, useEffect } from "react";

import "./App.css";
const API = "http://localhost:5000";
const shops = [
  { id: 1, name: "Malar Crafts", category: "Handmade & Gifts", rating: 4.8, icon: "🎨" },
  { id: 2, name: "Anbu Fashions", category: "Fashion & Clothing", rating: 4.6, icon: "👗" },
  { id: 3, name: "Green Glow", category: "Beauty & Wellness", rating: 4.7, icon: "🌿" },
];



const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

function App() {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState(emptyProfile);

  const [showCustomerDashboard, setShowCustomerDashboard] = useState(false);
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);

  const [showSellerDashboard, setShowSellerDashboard] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showMyProducts, setShowMyProducts] = useState(false);
  const [showSellerOrders, setShowSellerOrders] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [productCategory, setProductCategory] = useState("");
  const [productShop, setProductShop] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [orders, setOrders] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        const formattedProducts = data.map((product) => ({ ...product, id: product._id }));
        setProducts(formattedProducts);
      })
      .catch((error) => console.error("Failed to fetch products:", error));
  }, []);

  const authHeaders = () => {

    const token = localStorage.getItem("nammamart_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadMyProducts = async () => {
    try {
      const r = await fetch("http://localhost:5000/api/products/seller/my", { headers: authHeaders() });
      if (r.ok) {
        const d = await r.json();
        setSellerProducts(d.map((p) => ({ ...p, id: p._id })));
      }
    } catch (e) { console.error(e); }
  };

  const loadOrders = async () => {
    try {
      const ep = userRole === "Seller" ? "http://localhost:5000/api/orders/seller" : "http://localhost:5000/api/orders/mine";
      const r = await fetch(ep, { headers: authHeaders() });
      if (r.ok) {
        const d = await r.json();
        setOrders(d.map((o) => ({ ...o, id: o._id })));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const t = localStorage.getItem("nammamart_token");
    const u = localStorage.getItem("nammamart_user");
    if (t && u) {
      const x = JSON.parse(u);
      setIsLoggedIn(true);
      setUserRole(x.role);
      setCurrentUser({ name: x.name || "", email: x.email || "", phone: x.phone || "", address: x.address || "" });
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
      if (userRole === "Seller") loadMyProducts();
    }
  }, [isLoggedIn, userRole]);

  const allProducts = useMemo(
    () => products,
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return allProducts.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.shop.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, selectedCategory]);

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const totalSales = orders.reduce((total, order) => total + order.total, 0);

  const closeAllPages = () => {
    setShowCart(false);
    setShowWishlist(false);
    setShowCheckout(false);
    setShowOrders(false);
    setShowCustomerDashboard(false);
    setShowCustomerProfile(false);
    setShowSellerDashboard(false);
    setShowAddProduct(false);
    setShowMyProducts(false);
    setShowSellerOrders(false);
    setSelectedProduct(null);
  };

  const goHome = () => {
    closeAllPages();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (index) => {
    setCart((currentCart) =>
      currentCart.map((item, i) =>
        i === index
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (index) => {
    setCart((currentCart) =>
      currentCart
        .map((item, i) =>
          i === index
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (index) => {
    setCart((currentCart) =>
      currentCart.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some((item) => item.id === product.id);
      return exists
        ? currentWishlist.filter((item) => item.id !== product.id)
        : [...currentWishlist, product];
    });
  };

  const resetProductForm = () => {
    setProductName("");
    setProductPrice("");
    setProductStock(0);
    setProductCategory("");
    setProductShop("");
    setEditingProductId(null);
  };

  const editSellerProduct = (id) => { const p=sellerProducts.find(x=>x.id===id); if(!p)return;setEditingProductId(id);setProductName(p.name);setProductPrice(p.price);setProductCategory(p.category);setProductShop(p.shop);setShowMyProducts(false);setShowAddProduct(true); };
  const deleteSellerProduct = async (id) => { if(!window.confirm("Are you sure you want to delete this product?"))return;try{const r=await fetch(`http://localhost:5000/api/products/${id}`,{method:"DELETE",headers:authHeaders()});const d=await r.json();if(!r.ok)throw new Error(d.message);setSellerProducts(x=>x.filter(p=>p.id!==id));setProducts(x=>x.filter(p=>p.id!==id));alert("Product deleted successfully! 🗑️");}catch(e){alert(`Failed to delete product: ${e.message}`);} };
  const handleSaveProduct = async () => { if(!productName.trim()||!productPrice||!productCategory.trim()||!productShop.trim()){alert("Please fill all product details.");return;}
  const data={name:productName.trim(),price:Number(productPrice), stock:Number(productStock),rating:5,shop:productShop.trim(),image:"🛍️",category:productCategory.trim()};try{const url=editingProductId?`http://localhost:5000/api/products/${editingProductId}`:"http://localhost:5000/api/products";const r=await fetch(url,{method:editingProductId?"PUT":"POST",headers:authHeaders(),body:JSON.stringify(data)});const d=await r.json();if(!r.ok)throw new Error(d.message);const p={...d,id:d._id};if(editingProductId){setProducts(x=>x.map(a=>a.id===editingProductId?p:a));setSellerProducts(x=>x.map(a=>a.id===editingProductId?p:a));alert("Product updated successfully! ✨");}else{setProducts(x=>[p,...x]);setSellerProducts(x=>[p,...x]);alert("Product added successfully! 🎉");}resetProductForm();setShowAddProduct(false);setShowSellerDashboard(true);}catch(e){alert(`Failed to save product: ${e.message}`);} };

  const handleSignup = async () => { if(!selectedRole){alert("Please select Customer or Seller.");return;} if(!signupName.trim()||!signupEmail.trim()||!signupPassword){alert("Please fill all signup details.");return;} try{const r=await fetch("http://localhost:5000/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:signupName,email:signupEmail,password:signupPassword,role:selectedRole})});const d=await r.json();if(!r.ok)throw new Error(d.message);localStorage.setItem("nammamart_token",d.token);localStorage.setItem("nammamart_user",JSON.stringify(d.user));setIsLoggedIn(true);setUserRole(d.user.role);setCurrentUser({name:d.user.name,email:d.user.email,phone:d.user.phone||"",address:d.user.address||""});setShowSignup(false);setSignupName("");setSignupEmail("");setSignupPassword("");setSelectedRole("");alert("Account created successfully! 🎉");if(d.user.role==="Seller")setShowSellerDashboard(true);else setShowCustomerDashboard(true);}catch(e){alert(`Signup failed: ${e.message}`);} };

  const handleLogin = async () => { if(!loginEmail.trim()||!loginPassword){alert("Please enter email and password.");return;} if(!selectedRole){alert("Please select Customer or Seller.");return;} try{const r=await fetch("http://localhost:5000/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:loginEmail,password:loginPassword,role:selectedRole})});const d=await r.json();if(!r.ok)throw new Error(d.message);localStorage.setItem("nammamart_token",d.token);localStorage.setItem("nammamart_user",JSON.stringify(d.user));setIsLoggedIn(true);setUserRole(d.user.role);setCurrentUser({name:d.user.name,email:d.user.email,phone:d.user.phone||"",address:d.user.address||""});setShowLogin(false);setLoginEmail("");setLoginPassword("");setSelectedRole("");alert("Login successful! 🔐");if(d.user.role==="Seller")setShowSellerDashboard(true);else setShowCustomerDashboard(true);}catch(e){alert(`Login failed: ${e.message}`);} };

  const logout = () => {localStorage.removeItem("nammamart_token");localStorage.removeItem("nammamart_user");setIsLoggedIn(false);setUserRole("");setCurrentUser(emptyProfile);setOrders([]);setSellerProducts([]);closeAllPages();alert("Logged out successfully.");};

  const placeOrder = async () => { if(!customerName.trim()||!customerPhone.trim()||!customerAddress.trim()){alert("Please fill all delivery details.");return;}if(!cart.length){alert("Your cart is empty.");return;}if(!isLoggedIn||userRole!=="Customer"){alert("Please login as a Customer before placing an order.");setShowCheckout(false);setShowLogin(true);return;}try{const r=await fetch("http://localhost:5000/api/orders",{method:"POST",headers:authHeaders(),body:JSON.stringify({customerName,customerPhone,customerAddress,products:cart.map(i=>({productId:i.id,name:i.name,price:i.price,quantity:i.quantity||1,shop:i.shop})),total:cartTotal})});const d=await r.json();if(!r.ok)throw new Error(d.message);setOrders(x=>[{...d,id:d._id},...x]);setCart([]);setCustomerName("");setCustomerPhone("");setCustomerAddress("");setShowCheckout(false);setOrderPlaced(true);}catch(e){alert(`Order failed: ${e.message}`);} };
  const updateOrderStatus = async (id,status) => {try{const r=await fetch(`http://localhost:5000/api/orders/${id}/status`,{method:"PUT",headers:authHeaders(),body:JSON.stringify({status})});const d=await r.json();if(!r.ok)throw new Error(d.message);setOrders(x=>x.map(o=>o.id===id?{...o,status:d.status}:o));}catch(e){alert(e.message);}};
  const cancelOrder = async (id) => {
  try {
    const r = await fetch(
      `http://localhost:5000/api/orders/${id}/cancel`,
      {
        method: "PUT",
        headers: authHeaders(),
      }
    );

    const d = await r.json();

    if (!r.ok) throw new Error(d.message);

    setOrders((x) =>
      x.map((o) =>
        o.id === id ? { ...o, status: d.status } : o
      )
    );

    alert("Order cancelled successfully! ❌");
  } catch (e) {
    alert(e.message);
  }
};
  const openCart = () => {
    closeAllPages();
    setShowCart(true);
  };

  const openWishlist = () => {
    closeAllPages();
    setShowWishlist(true);
  };

  const openOrders = () => {
    closeAllPages();
    setShowOrders(true);
  };

  const openCustomerDashboard = () => {
    closeAllPages();
    setShowCustomerDashboard(true);
  };

  const openSellerDashboard = () => {
    closeAllPages();
    setShowSellerDashboard(true);
  };

  if (showLogin) {
    return (
      <div className="page-center">
        <div className="auth-card">
          <h1>Welcome to NammaMart 🛍️</h1>
          <p>Login to continue</p>

          <div className="role-selection">
            <button
              className={selectedRole === "Customer" ? "active-role" : ""}
              onClick={() => setSelectedRole("Customer")}
            >
              Customer
            </button>
            <button
              className={selectedRole === "Seller" ? "active-role" : ""}
              onClick={() => setSelectedRole("Seller")}
            >
              Seller
            </button>
          </div>

          <input
            type="email"
            placeholder="Enter your email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button className="primary-btn full-btn" onClick={handleLogin}>
            Login 🔐
          </button>

          <p className="switch-text">
            Don't have an account?{" "}
            <button
              onClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            >
              Sign Up
            </button>
          </p>

          <button className="back-btn" onClick={goHome}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (showSignup) {
    return (
      <div className="page-center">
        <div className="auth-card">
          <h1>Create Account 🛍️</h1>
          <p>Join NammaMart</p>

          <div className="role-selection">
            <button
              className={selectedRole === "Customer" ? "active-role" : ""}
              onClick={() => setSelectedRole("Customer")}
            >
              Customer
            </button>
            <button
              className={selectedRole === "Seller" ? "active-role" : ""}
              onClick={() => setSelectedRole("Seller")}
            >
              Seller
            </button>
          </div>

          <input
            type="text"
            placeholder="Enter your name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Create password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />

          <button className="primary-btn full-btn" onClick={handleSignup}>
            Sign Up 📝
          </button>

          <p className="switch-text">
            Already have an account?{" "}
            <button
              onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            >
              Login
            </button>
          </p>

          <button className="back-btn" onClick={goHome}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="page-center">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with NammaMart.</p>
          <button
            className="primary-btn"
            onClick={() => {
              setOrderPlaced(false);
              goHome();
            }}
          >
            Continue Shopping 🛍️
          </button>
        </div>
      </div>
    );
  }

  if (showCustomerProfile) {
    return (
      <div className="dashboard-page">
        <button
          className="back-btn"
          onClick={() => {
            setShowCustomerProfile(false);
            setShowCustomerDashboard(true);
          }}
        >
          ← Back to Dashboard
        </button>

        <div className="profile-card">
          <h1>My Profile 👤</h1>

          <label>Name</label>
          <input
            value={currentUser.name}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, name: e.target.value })
            }
          />

          <label>Email</label>
          <input
            type="email"
            value={currentUser.email}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.target.value })
            }
          />

          <label>Phone</label>
          <input
            value={currentUser.phone}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, phone: e.target.value })
            }
            placeholder="Enter phone number"
          />

          <label>Address</label>
          <textarea
            value={currentUser.address}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, address: e.target.value })
            }
            placeholder="Enter delivery address"
          />

          <button
            className="primary-btn"
            onClick={async () => { try { const r=await fetch("http://localhost:5000/api/users/me",{method:"PUT",headers:authHeaders(),body:JSON.stringify(currentUser)});const d=await r.json();if(!r.ok)throw new Error(d.message);const u=d.user;setCurrentUser({name:u.name,email:u.email,phone:u.phone||"",address:u.address||""});localStorage.setItem("nammamart_user",JSON.stringify(u));alert("Profile updated successfully! ✨");setShowCustomerProfile(false);setShowCustomerDashboard(true);}catch(e){alert(`Profile update failed: ${e.message}`);}}}
          >
            Save Profile
          </button>
        </div>
      </div>
    );
  }

  if (showCustomerDashboard) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-top">
          <button className="back-btn" onClick={goHome}>
            ← Home
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="dashboard-title">
          <p>WELCOME BACK</p>
          <h1>Customer Dashboard 👤</h1>
          <span>{currentUser.name || "NammaMart Customer"}</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>📦</span>
            <p>Total Orders</p>
            <strong>{orders.length}</strong>
          </div>
          <div className="stat-card">
            <span>❤️</span>
            <p>Wishlist</p>
            <strong>{wishlist.length}</strong>
          </div>
          <div className="stat-card">
            <span>🛒</span>
            <p>Cart Items</p>
            <strong>{cartCount}</strong>
          </div>
        </div>

        <div className="dashboard-menu">
          <button onClick={openOrders}>📦 My Orders</button>
          <button onClick={openWishlist}>❤️ Wishlist</button>
          <button onClick={openCart}>🛒 My Cart</button>
          <button
            onClick={() => {
              setShowCustomerDashboard(false);
              setShowCustomerProfile(true);
            }}
          >
            👤 My Profile
          </button>
          <button onClick={goHome}>🛍️ Continue Shopping</button>
        </div>

        <div className="dashboard-card">
          <h2>Quick Overview</h2>
          <p>
            Manage your orders, wishlist, cart and profile from one place.
          </p>
          <div className="mini-info">
            <div>
              <span>Latest Order Status</span>
              <strong>{orders[0]?.status || "No orders yet"}</strong>
            </div>
            <div>
              <span>Wishlist Items</span>
              <strong>{wishlist.length}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSellerDashboard) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-top">
          <button className="back-btn" onClick={goHome}>
            ← Home
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="dashboard-title">
          <p>SELLER PANEL</p>
          <h1>Seller Dashboard 🏪</h1>
          <span>Manage your local business</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>📦</span>
            <p>Total Orders</p>
            <strong>{orders.length}</strong>
          </div>
          <div className="stat-card">
            <span>💰</span>
            <p>Total Sales</p>
            <strong>₹{totalSales}</strong>
          </div>
          <div className="stat-card">
            <span>🛍️</span>
            <p>Total Products</p>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className="dashboard-menu">
          <button
            onClick={() => {
              resetProductForm();
              setShowSellerDashboard(false);
              setShowAddProduct(true);
            }}
          >
            ➕ Add Product
          </button>
          <button
            onClick={() => {
              setShowSellerDashboard(false);
              setShowMyProducts(true);
            }}
          >
            📦 My Products
          </button>
          <button
            onClick={() => {
              setShowSellerDashboard(false);
              setShowSellerOrders(true);
            }}
          >
            📋 Customer Orders
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Seller Overview</h2>
          <p>Add products and manage customer orders from this dashboard.</p>
        </div>
      </div>
    );
  }

  if (showAddProduct) {
    return (
      <div className="dashboard-page">
        <button
          className="back-btn"
          onClick={() => {
            resetProductForm();
            setShowAddProduct(false);
            setShowSellerDashboard(true);
          }}
        >
          ← Back to Dashboard
        </button>

        <div className="form-card">
          <h1>{editingProductId ? "Edit Product ✏️" : "Add New Product ➕"}</h1>

          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
          <label>Stock Quantity</label>
<input
  type="number"
  min="0"
  placeholder="Enter stock quantity"
  value={productStock}
  onChange={(e) => setProductStock(e.target.value)}
/>
          <input
            type="text"
            placeholder="Category"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Shop Name"
            value={productShop}
            onChange={(e) => setProductShop(e.target.value)}
          />

          <button className="primary-btn full-btn" onClick={handleSaveProduct}>
            {editingProductId ? "Update Product ✨" : "Add Product ➕"}
          </button>
        </div>
      </div>
    );
  }

  if (showMyProducts) {
    return (
      <div className="dashboard-page">
        <button
          className="back-btn"
          onClick={() => {
            setShowMyProducts(false);
            setShowSellerDashboard(true);
          }}
        >
          ← Back to Dashboard
        </button>

        <h1>My Products 📦</h1>

        {sellerProducts.length === 0 ? (
          <div className="empty-card">
            <h2>No products added yet.</h2>
            <p>Add your first product to show it on NammaMart.</p>
            <button
              className="primary-btn"
              onClick={() => {
                resetProductForm();
                setShowMyProducts(false);
                setShowAddProduct(true);
              }}
            >
              ➕ Add Product
            </button>
          </div>
        ) : (
          <div className="seller-product-list">
            {sellerProducts.map((product) => (
              <div className="seller-product-card" key={product.id}>
                <div className="product-image small">{product.image}</div>
                <div className="seller-product-info">
                  <h3>{product.name}</h3>
                  <p>{product.shop}</p>
                  <strong>₹{product.price}</strong>
                </div>
                <button
                  className="edit-btn"
                  onClick={() => editSellerProduct(product.id)}
                >
                  Edit ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteSellerProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (showSellerOrders) {
    return (
      <div className="dashboard-page">
        <button
          className="back-btn"
          onClick={() => {
            setShowSellerOrders(false);
            setShowSellerDashboard(true);
          }}
        >
          ← Back to Dashboard
        </button>

        <h1>Customer Orders 📋</h1>

        {orders.length === 0 ? (
          <div className="empty-card">
            <h2>No customer orders yet.</h2>
            <p>Orders placed by customers will appear here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <h3>Order #{String(order.id).slice(-6)}</h3>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option>Order Placed</option>
                    <option>Confirmed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.customerPhone}</p>
                <p><strong>Address:</strong> {order.customerAddress}</p>

                <div className="order-products">
                  {order.products.map((item, index) => (
                    <div key={`${item.id}-${index}`}>
                      {item.name} × {item.quantity || 1}
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  <span>Status: {order.status}</span>
                  <strong>₹{order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (showOrders) {
    return (
      <div className="dashboard-page">
        <button className="back-btn" onClick={goHome}>
          ← Home
        </button>

        <h1>My Orders 📦</h1>

        {orders.length === 0 ? (
          <div className="empty-card">
            <h2>No orders placed yet.</h2>
            <p>Your placed orders will appear here.</p>
            <button className="primary-btn" onClick={goHome}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <h3>Order #{String(order.id).slice(-6)}</h3>
                  <span className="status-badge">{order.status}</span>
                </div>

                {order.products.map((item, index) => (
                  <div className="order-line" key={`${item.id}-${index}`}>
                    <span>{item.name} × {item.quantity || 1}</span>
                    <strong>
                      ₹{item.price * (item.quantity || 1)}
                    </strong>
                  </div>
                ))}
                {(order.status === "Order Placed" || order.status === "Confirmed") && (
  <button
    className="cancel-order-btn"
    onClick={() => cancelOrder(order.id)}
  >
    Cancel Order ❌
  </button>
)}

                <div className="order-total">
                  <span>Total</span>
                  <strong>₹{order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (showWishlist) {
    return (
      <div className="dashboard-page">
        <button className="back-btn" onClick={goHome}>
          ← Continue Shopping
        </button>

        <h1>Your Wishlist ❤️</h1>

        {wishlist.length === 0 ? (
          <div className="empty-card">
            <h2>Your wishlist is empty.</h2>
            <p>Add products you love and find them here later.</p>
          </div>
        ) : (
          <div className="product-grid">
            {wishlist.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>🏪 {product.shop}</p>
                  <div className="product-bottom">
                    <strong>₹{product.price}</strong>
                    <span>⭐ {product.rating}</span>
                  </div>
                  <div className="card-actions">
                    <button
  className="primary-btn"
  disabled={product.stock <= 0}
  onClick={() => addToCart(product)}
>
  {product.stock > 0 ? "Add to Cart 🛒" : "Out of Stock"}
</button>
                    <button
                      className="delete-btn"
                      onClick={() => toggleWishlist(product)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (showCart) {
    return (
      <div className="dashboard-page">
        <button className="back-btn" onClick={goHome}>
          ← Continue Shopping
        </button>

        <h1>Your Cart 🛒</h1>

        {cart.length === 0 ? (
          <div className="empty-card">
            <h2>Your cart is empty.</h2>
            <p>Add products to continue.</p>
            <button className="primary-btn" onClick={goHome}>
              Explore Products
            </button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${index}`}>
                  <div className="product-image small">{item.image}</div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.shop}</p>
                    <strong>₹{item.price}</strong>
                  </div>

                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(index)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => increaseQuantity(index)}>+</button>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="summary-card">
              <h2>Cart Summary</h2>
              <div>
                <span>Total Items</span>
                <strong>{cartCount}</strong>
              </div>
              <div>
                <span>Total Amount</span>
                <strong>₹{cartTotal}</strong>
              </div>

              <button
                className="primary-btn full-btn"
                onClick={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
              >
                Proceed to Checkout 📦
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="dashboard-page">
        <button
          className="back-btn"
          onClick={() => {
            setShowCheckout(false);
            setShowCart(true);
          }}
        >
          ← Back to Cart
        </button>

        <div className="form-card checkout-card">
          <h1>Checkout 📦</h1>

          <label>Full Name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
          />

          <label>Phone Number</label>
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Enter phone number"
          />

          <label>Delivery Address</label>
          <textarea
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            placeholder="Enter delivery address"
          />

          <h2>Order Summary</h2>
          {cart.map((item, index) => (
            <div className="order-line" key={`${item.id}-${index}`}>
              <span>{item.name} × {item.quantity || 1}</span>
              <strong>₹{item.price * (item.quantity || 1)}</strong>
            </div>
          ))}

          <div className="order-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <button className="primary-btn full-btn" onClick={placeOrder}>
            Place Order 📦
          </button>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="dashboard-page">
        <button
          className="back-btn"
          onClick={() => setSelectedProduct(null)}
        >
          ← Back to Products
        </button>

        <div className="product-detail-card">
          <div className="details-image">{selectedProduct.image}</div>

          <div className="details-content">
            <span className="category-badge">{selectedProduct.category}</span>
            <h1>{selectedProduct.name}</h1>
            <p>🏪 {selectedProduct.shop}</p>
            <p>⭐ {selectedProduct.rating} / 5</p>
            <h2>₹{selectedProduct.price}</h2>
            <p>
              A quality product from a trusted local seller on NammaMart.
              Support local businesses while shopping online.
            </p>

            <div className="card-actions">
              <button
                className="primary-btn"
                onClick={() => {
                  addToCart(selectedProduct);
                  alert("Added to cart! 🛒");
                }}
              >
                Add to Cart
              </button>
              <button
                className="secondary-btn"
                onClick={() => toggleWishlist(selectedProduct)}
              >
                {wishlist.some((item) => item.id === selectedProduct.id)
                  ? "❤️ Wishlisted"
                  : "♡ Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <button className="logo" onClick={goHome}>
          🛍️ NammaMart
        </button>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search products, shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="primary-btn">Search</button>
        </div>

        <nav className="nav-links">
          <button onClick={goHome}>Home</button>
          <button
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Products
          </button>
          <button
            onClick={() =>
              document
                .getElementById("shops")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Shops
          </button>
          <button onClick={openCart}>Cart 🛒 ({cartCount})</button>
          <button onClick={openWishlist}>Wishlist ❤️ ({wishlist.length})</button>

          {isLoggedIn && userRole === "Customer" && (
            <button onClick={openCustomerDashboard}>Dashboard 👤</button>
          )}

          {isLoggedIn && userRole === "Seller" && (
            <button onClick={openSellerDashboard}>Seller Dashboard 🏪</button>
          )}

          {!isLoggedIn ? (
            <button
              className="login-nav-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          ) : (
            <button className="login-nav-btn" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="small-title">DISCOVER LOCAL</p>
            <h1>
              Shop Local.
              <br />
              <span>Support Local.</span>
            </h1>
            <p>
              Discover products from local businesses and bring your favourite
              neighbourhood shops online.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Products
              </button>
              <button
                className="secondary-btn"
                onClick={() =>
                  document
                    .getElementById("shops")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Shops
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-icon">🏪</div>
            <h3>Local Business</h3>
            <p>One platform. More customers.</p>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-heading">
            <p>EXPLORE</p>
            <h2>Shop by Category</h2>
          </div>

          <div className="category-grid">
            {["All", "Fashion", "Gifts", "Beauty", "Food", "Home", "Stationery"].map(
              (category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category-card active-category"
                      : "category-card"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "All" && "🛍️"}
                  {category === "Fashion" && "👗"}
                  {category === "Gifts" && "🎁"}
                  {category === "Beauty" && "💄"}
                  {category === "Food" && "🍪"}
                  {category === "Home" && "🏠"}
                  {category === "Stationery" && "📚"}
                  <h3>{category}</h3>
                </button>
              )
            )}
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <p>POPULAR</p>
            <h2>Featured Products</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-card">
              <h2>No products found 🔎</h2>
              <p>Try another product name, shop or category.</p>
              <button
                className="primary-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div
                  className="product-card"
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-image">{product.image}</div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>🏪 {product.shop}</p>

                    <div className="product-bottom">
                      <strong>₹{product.price}</strong>
                      <span>⭐ {product.rating}</span>
                    </div>

                    <div className="card-actions">
                      <button
                        className="primary-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="wishlist-icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                      >
                        {wishlist.some((item) => item.id === product.id)
                          ? "❤️"
                          : "♡"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="shops-section" id="shops">
          <div className="section-heading">
            <p>MEET OUR SELLERS</p>
            <h2>Featured Local Shops</h2>
          </div>

          <div className="shops-grid">
            {shops.map((shop) => (
              <div className="shop-card" key={shop.id}>
                <div className="shop-icon">{shop.icon}</div>
                <h3>{shop.name}</h3>
                <p>{shop.category}</p>
                <span>⭐ {shop.rating}</span>
                <button
                  className="secondary-btn full-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Shop
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>🛍️ NammaMart</h2>
            <p>
              Discover local shops, support small businesses, and shop
              products you love.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <button onClick={goHome}>Home</button>
            <button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Products
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("shops")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Local Shops
            </button>
          </div>

          <div className="footer-column">
            <h3>For Sellers</h3>
            <button
              onClick={() => {
                setSelectedRole("Seller");
                setShowLogin(true);
              }}
            >
              Seller Login
            </button>
            <button
              onClick={() => {
                setSelectedRole("Seller");
                setShowSignup(true);
              }}
            >
              Become a Seller
            </button>
          </div>

          <div className="footer-column">
            <h3>Help</h3>
            <button onClick={() => alert("Contact: support@nammamart.com")}>
              Contact Us
            </button>
            <button onClick={() => alert("NammaMart FAQs coming soon.")}>
              FAQs
            </button>
            <button onClick={() => alert("Privacy Policy page coming soon.")}>
              Privacy Policy
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 NammaMart. All rights reserved.</p>
          <p>Made for local businesses ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
