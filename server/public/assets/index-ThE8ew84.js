(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const Jt=new Map;let Kt=null,Lt=null;function x(e,s){Jt.set(e,s)}function de(e){Kt=e}function pe(e){Lt=e}function ue(){const e=window.location.hash;return!e||e==="#"?"/":e.slice(1)}function me(e){for(const[s,n]of Jt){const a=[],o=s.replace(/:([^/]+)/g,(l,p)=>(a.push(p),"([^/]+)")),r=new RegExp(`^${o}$`),i=e.match(r);if(i){const l={};return a.forEach((p,d)=>{l[p]=i[d+1]}),{handler:n,params:l}}}return null}async function Rt(){const e=ue(),s=me(e),n=(s==null?void 0:s.handler)||Kt,a=(s==null?void 0:s.params)||{};Lt&&!await Lt(e,a)||n&&await n(a)}function B(e){window.location.hash=e}function ve(){window.addEventListener("hashchange",Rt),Rt()}const be={app:{name:"CoreTrade ERP",company:"Islam Enterprise",loading:"Loading…",saving:"Saving…",deleting:"Deleting…",error:"An error occurred",retry:"Retry",back:"Back",close:"Close",cancel:"Cancel",confirm:"Confirm",save:"Save",delete:"Delete",edit:"Edit",add:"Add",view:"View",print:"Print",export:"Export CSV",import:"Import CSV",search:"Search…",filter:"Filter",clear:"Clear",submit:"Submit",update:"Update",noData:"No data found",selectOption:"Select…",actions:"Actions",status:"Status",active:"Active",inactive:"Inactive",yes:"Yes",no:"No",all:"All",today:"Today",thisMonth:"This Month",custom:"Custom Range",from:"From",to:"To",date:"Date",notes:"Notes",optional:"Optional",required:"Required",total:"Total",subtotal:"Subtotal",discount:"Discount",paid:"Paid",due:"Due",balance:"Balance"},auth:{login:"Login",logout:"Logout",username:"Username",password:"Password",loginBtn:"Login to ERP",loggingIn:"Logging in…",logoutConfirm:"Are you sure you want to logout?",changePassword:"Change Password",currentPassword:"Current Password",newPassword:"New Password",confirmPassword:"Confirm Password",passwordChanged:"Password changed successfully",invalidCredentials:"Invalid username or password",sessionExpired:"Session expired. Please login again.",welcome:"Welcome back",serverUrl:"Server URL (Host IP / Domain)",serverUrlHint:"For Mobile APK, enter backend URL (e.g. http://192.168.1.100:5000 or server domain)"},nav:{dashboard:"Dashboard",pos:"POS",sales:"Sales",purchases:"Purchases",products:"Products",inventory:"Inventory",customers:"Customers",suppliers:"Suppliers",payments:"Payments",accounts:"Accounts",expenses:"Expenses",reports:"Reports",users:"Users",settings:"Settings",backup:"Backup",customerPayments:"Customer Payments",supplierPayments:"Supplier Payments"},dashboard:{title:"Dashboard",todaySales:"Today's Sales",todayPurchases:"Today's Purchases",todayExpenses:"Today's Expenses",todayProfit:"Today's Profit",paymentsReceived:"Payments Received",customerDue:"Customer Due",supplierDue:"Supplier Due",cashBalance:"Cash Balance",bankBalance:"Bank Balance",totalAvailable:"Total Available",lowStockAlert:"Low Stock Alert",recentSales:"Recent Sales",quickActions:"Quick Actions",salesTrend:"Sales Trend (30 days)",lowStockItems:"{n} items low on stock",viewLowStock:"View Low Stock",noRecentSales:"No sales today"},quick:{newSale:"New Sale",newPurchase:"New Purchase",receivePayment:"Receive Payment",paySupplier:"Pay Supplier",addExpense:"Add Expense",addProduct:"Add Product",addCustomer:"Add Customer"},pos:{title:"Point of Sale",searchProduct:"Search product by name, SKU…",cart:"Cart",emptyCart:"Cart is empty. Add products to start.",product:"Product",qty:"Qty",unit:"Unit",unitPrice:"Unit Price",itemDiscount:"Item Discount",itemTotal:"Total",removeItem:"Remove item",clearCart:"Clear Cart",clearCartConfirm:"Are you sure you want to clear the cart?",orderSummary:"Order Summary",saleType:"Sale Type",cashSale:"Cash Sale",creditSale:"Credit Sale",wholesaleSale:"Wholesale",selectCustomer:"Select Customer",paymentAccount:"Payment Account",amountPaid:"Amount Paid",changeDue:"Change Due",completeSale:"Complete Sale",completingLoading:"Processing…",saleSuccess:"Sale completed successfully",invoiceNo:"Invoice",printReceipt:"Print Receipt",newSale:"New Sale",insufficientStock:"Insufficient stock for",available:"Available",customerRequired:"Please select a customer for credit sale",accountRequired:"Please select a payment account",itemsRequired:"Please add at least one item",unitPriceRequired:"Enter unit price for all items"},products:{title:"Products",add:"Add Product",edit:"Edit Product",delete:"Deactivate Product",deleteConfirm:"Deactivate this product? It will not appear in POS.",name:"Product Name",nameBn:"Product Name (Bangla)",sku:"SKU / Code",category:"Category",brand:"Brand",size:"Size",unit:"Unit",retailPrice:"Retail Price",wholesalePrice:"Wholesale Price",purchaseCost:"Purchase Cost",currentStock:"Current Stock",openingStock:"Opening Stock",lowStockAlert:"Low Stock Alert",isActive:"Active",notes:"Notes",basicInfo:"Basic Information",pricing:"Pricing",inventory:"Inventory",saved:"Product saved successfully",noProducts:"No products found",lowStockBadge:"Low Stock",searchPlaceholder:"Search by name, SKU, brand…",filterCategory:"Filter by category",showLowStock:"Low stock only"},categories:{title:"Categories",add:"Add Category",edit:"Edit Category",name:"Category Name",nameBn:"Category Name (Bangla)",slug:"Slug",sortOrder:"Sort Order",saved:"Category saved",deleted:"Category deleted",hasProducts:"Category has products. Deactivate instead."},inventory:{title:"Inventory",movements:"Stock Movements",adjust:"Adjust Stock",adjustIn:"Stock In (Add)",adjustOut:"Stock Out (Remove)",lowStock:"Low Stock",summary:"Stock Summary",adjustConfirm:"Record stock adjustment?",product:"Product",movementType:"Type",qty:"Quantity",balanceAfter:"Balance After",reference:"Reference",reason:"Reason",adjustSuccess:"Stock adjusted successfully",movementTypes:{purchase:"Purchase",sale:"Sale",return_in:"Return In",return_out:"Return Out",adjustment_in:"Adjustment In",adjustment_out:"Adjustment Out",opening:"Opening Stock"},stockValue:"Stock Value",costValue:"Cost Value",retailValue:"Retail Value"},customers:{title:"Customers",add:"Add Customer",edit:"Edit Customer",delete:"Delete Customer",deleteConfirm:"Delete this customer? This cannot be undone.",name:"Customer Name",phone:"Phone",address:"Address",creditLimit:"Credit Limit",currentDue:"Current Due",lastTransaction:"Last Transaction",ledger:"View Ledger",receivePayment:"Receive Payment",newSale:"New Sale",saved:"Customer saved",noCustomers:"No customers found",searchPlaceholder:"Search by name or phone…"},suppliers:{title:"Suppliers",add:"Add Supplier",edit:"Edit Supplier",delete:"Delete Supplier",deleteConfirm:"Delete this supplier?",name:"Supplier Name",phone:"Phone",address:"Address",currentDue:"Current Payable",lastTransaction:"Last Transaction",ledger:"View Ledger",makePayment:"Make Payment",newPurchase:"New Purchase",saved:"Supplier saved",noSuppliers:"No suppliers found"},ledger:{title:"Ledger",date:"Date",description:"Description",debit:"Debit",credit:"Credit",balance:"Balance",openingBalance:"Opening Balance",closingBalance:"Closing Balance",noEntries:"No ledger entries for this period"},sales:{title:"Sales",invoice:"Invoice No.",date:"Sale Date",customer:"Customer",type:"Type",total:"Total",paid:"Paid",due:"Due",status:"Status",void:"Void Sale",voidConfirm:"Void this sale? Stock will be restored.",voidReason:"Void Reason",voided:"Voided",completed:"Completed",viewInvoice:"View Invoice",noSales:"No sales found",types:{cash:"Cash",credit:"Credit",wholesale:"Wholesale"}},purchases:{title:"Purchases",add:"New Purchase",invoice:"Purchase No.",date:"Purchase Date",supplier:"Supplier",total:"Total",paid:"Paid",due:"Due",noPurchases:"No purchases found",saved:"Purchase recorded successfully"},payments:{customerTitle:"Customer Payments",supplierTitle:"Supplier Payments",receivePayment:"Receive Payment",makePayment:"Make Payment",customer:"Customer",supplier:"Supplier",amount:"Amount",method:"Payment Method",reference:"Reference No.",account:"Account",paymentDate:"Payment Date",recorded:"Payment recorded successfully",methods:{cash:"Cash",bank_transfer:"Bank Transfer",cheque:"Cheque",mobile_banking:"Mobile Banking"}},accounts:{title:"Accounts",add:"Add Account",edit:"Edit Account",name:"Account Name",type:"Account Type",balance:"Balance",statement:"Statement",deposit:"Deposit",withdraw:"Withdraw",transfer:"Transfer",transferTo:"Transfer To",amount:"Amount",description:"Description",totalCash:"Total Cash",totalBank:"Total Bank",totalAvailable:"Total Available",noAccounts:"No accounts found",saved:"Account saved",deposited:"Deposit recorded",withdrawn:"Withdrawal recorded",transferred:"Transfer completed",types:{cash:"Cash",bank:"Bank",capital:"Capital"},txnTypes:{sale_payment:"Sale Payment",purchase_payment:"Purchase Payment",customer_payment:"Customer Payment",supplier_payment:"Supplier Payment",expense:"Expense",transfer_in:"Transfer In",transfer_out:"Transfer Out",deposit:"Deposit",withdrawal:"Withdrawal",opening:"Opening Balance"}},expenses:{title:"Expenses",add:"Add Expense",category:"Category",account:"Paid From",amount:"Amount",description:"Description",date:"Expense Date",noExpenses:"No expenses found",saved:"Expense recorded"},reports:{title:"Reports",profitLoss:"Profit & Loss",salesReport:"Sales Report",purchaseReport:"Purchase Report",stockReport:"Stock Report",expenseReport:"Expense Report",dateRange:"Date Range",generate:"Generate Report",totalSales:"Total Sales",totalPurchases:"Total Purchases",totalExpenses:"Total Expenses",grossProfit:"Gross Profit",netProfit:"Net Profit",grossMargin:"Gross Margin",netMargin:"Net Margin",income:"Income",cogs:"Cost of Goods Sold",expensesByCategory:"Expenses by Category",noData:"No data for this period"},users:{title:"User Management",add:"Add User",edit:"Edit User",username:"Username",fullName:"Full Name",password:"Password",role:"Role",lastLogin:"Last Login",isActive:"Active",resetPassword:"Reset Password",newPassword:"New Password",saved:"User saved",passwordReset:"Password reset successfully",roles:{admin:"Administrator",manager:"Manager",cashier:"Cashier"},roleDescriptions:{admin:"Full access to all features",manager:"Manage operations, no user management",cashier:"POS and basic operations"},deactivateConfirm:"Deactivate this user?",noUsers:"No users found"},settings:{title:"Settings",company:"Company Information",companyName:"Company Name",address:"Address",phone:"Phone",email:"Email",language:"Language",currency:"Currency Symbol",saved:"Settings saved",invoiceSettings:"Invoice Settings",invoicePrefix:"Invoice Prefix"},confirm:{title:"Are you sure?",irreversible:"This action cannot be undone.",deleteItem:"Delete this item? This cannot be undone.",voidSale:"Void this sale? Stock will be restored and this cannot be undone.",logout:"You will be logged out of the system."},toast:{success:"Success",error:"Error",warning:"Warning",info:"Info",networkError:"Network error. Please check your connection.",serverError:"Server error. Please try again.",unauthorized:"Session expired. Please login again.",forbidden:"You do not have permission to perform this action."},validation:{required:"{field} is required",minLength:"{field} must be at least {min} characters",maxLength:"{field} must be at most {max} characters",numeric:"{field} must be a valid number",positive:"{field} must be a positive number",email:"Enter a valid email address",passwordMismatch:"Passwords do not match"},table:{noResults:"No results found",showing:"Showing {from}–{to} of {total}",rowsPerPage:"Per page",prev:"Previous",next:"Next"}},ye={app:{name:"কোরট্রেড ERP",company:"ইসলাম এন্টারপ্রাইজ",loading:"লোড হচ্ছে…",saving:"সংরক্ষণ হচ্ছে…",deleting:"মুছে ফেলা হচ্ছে…",error:"একটি সমস্যা হয়েছে",retry:"আবার চেষ্টা করুন",back:"পেছনে",close:"বন্ধ করুন",cancel:"বাতিল",confirm:"নিশ্চিত করুন",save:"সংরক্ষণ করুন",delete:"মুছুন",edit:"সম্পাদনা",add:"যোগ করুন",view:"দেখুন",print:"প্রিন্ট করুন",export:"CSV এক্সপোর্ট",import:"CSV ইমপোর্ট",search:"খুঁজুন…",filter:"ফিল্টার",clear:"মুছুন",submit:"জমা দিন",update:"আপডেট",noData:"কোনো তথ্য পাওয়া যায়নি",selectOption:"বেছে নিন…",actions:"কার্যক্রম",status:"অবস্থা",active:"সক্রিয়",inactive:"নিষ্ক্রিয়",yes:"হ্যাঁ",no:"না",all:"সব",today:"আজকের",thisMonth:"এই মাসের",custom:"কাস্টম তারিখ",from:"থেকে",to:"পর্যন্ত",date:"তারিখ",notes:"মন্তব্য",optional:"ঐচ্ছিক",required:"আবশ্যক",total:"মোট",subtotal:"উপমোট",discount:"ছাড়",paid:"পরিশোধিত",due:"বাকি",balance:"ব্যালেন্স"},auth:{login:"লগইন",logout:"লগআউট",username:"ব্যবহারকারীর নাম",password:"পাসওয়ার্ড",loginBtn:"ERP-তে লগইন করুন",loggingIn:"লগইন হচ্ছে…",logoutConfirm:"আপনি কি সত্যিই লগআউট করতে চান?",changePassword:"পাসওয়ার্ড পরিবর্তন",currentPassword:"বর্তমান পাসওয়ার্ড",newPassword:"নতুন পাসওয়ার্ড",confirmPassword:"পাসওয়ার্ড নিশ্চিত করুন",passwordChanged:"পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে",invalidCredentials:"ভুল ব্যবহারকারীর নাম বা পাসওয়ার্ড",sessionExpired:"সেশন শেষ হয়েছে। আবার লগইন করুন।",welcome:"স্বাগতম",serverUrl:"সার্ভার URL (Host IP / ডোমেইন)",serverUrlHint:"মোবাইল APK-এর জন্য ব্যাকএন্ড URL লিখুন (যেমন http://192.168.1.100:5000)"},nav:{dashboard:"ড্যাশবোর্ড",pos:"পিওএস",sales:"বিক্রয়",purchases:"ক্রয়",products:"পণ্য",inventory:"স্টক",customers:"কাস্টমার",suppliers:"সাপ্লায়ার",payments:"পেমেন্ট",accounts:"হিসাব",expenses:"খরচ",reports:"রিপোর্ট",users:"ব্যবহারকারী",settings:"সেটিংস",backup:"ব্যাকআপ",customerPayments:"কাস্টমারের পেমেন্ট",supplierPayments:"সাপ্লায়ারের পেমেন্ট"},dashboard:{title:"ড্যাশবোর্ড",todaySales:"আজকের বিক্রয়",todayPurchases:"আজকের ক্রয়",todayExpenses:"আজকের খরচ",todayProfit:"আজকের লাভ",paymentsReceived:"গৃহীত পেমেন্ট",customerDue:"কাস্টমারের বাকি",supplierDue:"সাপ্লায়ারের বাকি",cashBalance:"নগদ ব্যালেন্স",bankBalance:"ব্যাংক ব্যালেন্স",totalAvailable:"মোট ক্যাশ",lowStockAlert:"স্বল্প স্টক সতর্কতা",recentSales:"সাম্প্রতিক বিক্রয়",quickActions:"দ্রুত কার্যক্রম",salesTrend:"বিক্রয়ের ধারা (৩০ দিন)",lowStockItems:"{n}টি পণ্যের স্টক কম",viewLowStock:"স্বল্প স্টক দেখুন",noRecentSales:"আজ কোনো বিক্রয় নেই"},quick:{newSale:"নতুন বিক্রয়",newPurchase:"নতুন ক্রয়",receivePayment:"কাস্টমারের টাকা গ্রহণ",paySupplier:"সাপ্লায়ারকে পেমেন্ট",addExpense:"খরচ যোগ করুন",addProduct:"পণ্য যোগ করুন",addCustomer:"কাস্টমার যোগ করুন"},pos:{title:"পয়েন্ট অব সেল",searchProduct:"পণ্যের নাম বা কোড দিয়ে খুঁজুন…",cart:"কার্ট",emptyCart:"কার্ট খালি। বিক্রয় শুরু করতে পণ্য যোগ করুন।",product:"পণ্য",qty:"পরিমাণ",unit:"একক",unitPrice:"একক মূল্য",itemDiscount:"পণ্য ছাড়",itemTotal:"মোট",removeItem:"পণ্য সরান",clearCart:"কার্ট খালি করুন",clearCartConfirm:"কার্ট খালি করতে চান?",orderSummary:"অর্ডার সারসংক্ষেপ",saleType:"বিক্রয়ের ধরন",cashSale:"নগদ বিক্রয়",creditSale:"বাকি বিক্রয়",wholesaleSale:"পাইকারি",selectCustomer:"কাস্টমার বেছে নিন",paymentAccount:"পেমেন্ট হিসাব",amountPaid:"পরিশোধের পরিমাণ",changeDue:"ফেরত",completeSale:"বিক্রয় সম্পন্ন করুন",completingLoading:"প্রক্রিয়া হচ্ছে…",saleSuccess:"বিক্রয় সফলভাবে সম্পন্ন হয়েছে",invoiceNo:"ইনভয়েস",printReceipt:"রসিদ প্রিন্ট",newSale:"নতুন বিক্রয়",insufficientStock:"অপর্যাপ্ত স্টক:",available:"পাওয়া যাচ্ছে",customerRequired:"বাকি বিক্রয়ের জন্য কাস্টমার বেছে নিন",accountRequired:"পেমেন্ট হিসাব বেছে নিন",itemsRequired:"অন্তত একটি পণ্য যোগ করুন",unitPriceRequired:"সব পণ্যের একক মূল্য দিন"},products:{title:"পণ্য",add:"পণ্য যোগ করুন",edit:"পণ্য সম্পাদনা",delete:"পণ্য নিষ্ক্রিয় করুন",deleteConfirm:"এই পণ্যটি নিষ্ক্রিয় করবেন? POS-এ দেখাবে না।",name:"পণ্যের নাম",nameBn:"পণ্যের নাম (বাংলা)",sku:"কোড / SKU",category:"বিভাগ",brand:"ব্র্যান্ড",size:"সাইজ",unit:"একক",retailPrice:"খুচরা মূল্য",wholesalePrice:"পাইকারি মূল্য",purchaseCost:"ক্রয় মূল্য",currentStock:"বর্তমান স্টক",openingStock:"প্রারম্ভিক স্টক",lowStockAlert:"স্বল্প স্টক সীমা",isActive:"সক্রিয়",notes:"মন্তব্য",basicInfo:"মূল তথ্য",pricing:"মূল্য",inventory:"স্টক",saved:"পণ্য সফলভাবে সংরক্ষিত হয়েছে",noProducts:"কোনো পণ্য পাওয়া যায়নি",lowStockBadge:"স্বল্প স্টক",searchPlaceholder:"নাম, কোড, ব্র্যান্ড দিয়ে খুঁজুন…",filterCategory:"বিভাগ অনুযায়ী ফিল্টার",showLowStock:"শুধু স্বল্প স্টক"},categories:{title:"বিভাগ",add:"বিভাগ যোগ করুন",edit:"বিভাগ সম্পাদনা",name:"বিভাগের নাম",nameBn:"বিভাগের নাম (বাংলা)",slug:"স্লাগ",sortOrder:"ক্রম",saved:"বিভাগ সংরক্ষিত হয়েছে",deleted:"বিভাগ মুছে ফেলা হয়েছে",hasProducts:"এই বিভাগে পণ্য আছে। বরং নিষ্ক্রিয় করুন।"},inventory:{title:"স্টক ব্যবস্থাপনা",movements:"স্টক চলাচল",adjust:"স্টক সমন্বয়",adjustIn:"স্টক বাড়ান (যোগ)",adjustOut:"স্টক কমান (বাদ)",lowStock:"স্বল্প স্টক",summary:"স্টক সারসংক্ষেপ",adjustConfirm:"স্টক সমন্বয় নিশ্চিত করুন?",product:"পণ্য",movementType:"ধরন",qty:"পরিমাণ",balanceAfter:"পরবর্তী স্টক",reference:"রেফারেন্স",reason:"কারণ",adjustSuccess:"স্টক সফলভাবে সমন্বিত হয়েছে",movementTypes:{purchase:"ক্রয়",sale:"বিক্রয়",return_in:"ফেরত আসা",return_out:"ফেরত পাঠানো",adjustment_in:"সমন্বয় (বাড়ানো)",adjustment_out:"সমন্বয় (কমানো)",opening:"প্রারম্ভিক স্টক"},stockValue:"স্টকের মূল্য",costValue:"ক্রয় মূল্যে",retailValue:"বিক্রয় মূল্যে"},customers:{title:"কাস্টমার",add:"কাস্টমার যোগ করুন",edit:"কাস্টমার সম্পাদনা",delete:"কাস্টমার মুছুন",deleteConfirm:"এই কাস্টমারকে মুছে ফেলবেন? এটি পূর্বাবস্থায় আনা যাবে না।",name:"কাস্টমারের নাম",phone:"ফোন",address:"ঠিকানা",creditLimit:"ক্রেডিট সীমা",currentDue:"বর্তমান বাকি",lastTransaction:"শেষ লেনদেন",ledger:"হিসাব খাতা",receivePayment:"পেমেন্ট গ্রহণ",newSale:"নতুন বিক্রয়",saved:"কাস্টমার সংরক্ষিত হয়েছে",noCustomers:"কোনো কাস্টমার পাওয়া যায়নি",searchPlaceholder:"নাম বা ফোন দিয়ে খুঁজুন…"},suppliers:{title:"সাপ্লায়ার",add:"সাপ্লায়ার যোগ করুন",edit:"সাপ্লায়ার সম্পাদনা",delete:"সাপ্লায়ার মুছুন",deleteConfirm:"এই সাপ্লায়ারকে মুছে ফেলবেন?",name:"সাপ্লায়ারের নাম",phone:"ফোন",address:"ঠিকানা",currentDue:"বর্তমান পাওনা",lastTransaction:"শেষ লেনদেন",ledger:"হিসাব খাতা",makePayment:"পেমেন্ট করুন",newPurchase:"নতুন ক্রয়",saved:"সাপ্লায়ার সংরক্ষিত হয়েছে",noSuppliers:"কোনো সাপ্লায়ার পাওয়া যায়নি"},ledger:{title:"হিসাব খাতা",date:"তারিখ",description:"বিবরণ",debit:"ডেবিট",credit:"ক্রেডিট",balance:"ব্যালেন্স",openingBalance:"প্রারম্ভিক ব্যালেন্স",closingBalance:"সমাপনী ব্যালেন্স",noEntries:"এই সময়ের জন্য কোনো লেনদেন নেই"},sales:{title:"বিক্রয়",invoice:"ইনভয়েস নম্বর",date:"বিক্রয়ের তারিখ",customer:"কাস্টমার",type:"ধরন",total:"মোট",paid:"পরিশোধিত",due:"বাকি",status:"অবস্থা",void:"বিক্রয় বাতিল",voidConfirm:"এই বিক্রয় বাতিল করবেন? স্টক ফেরত আসবে।",voidReason:"বাতিলের কারণ",voided:"বাতিল",completed:"সম্পন্ন",viewInvoice:"ইনভয়েস দেখুন",noSales:"কোনো বিক্রয় পাওয়া যায়নি",types:{cash:"নগদ",credit:"বাকি",wholesale:"পাইকারি"}},purchases:{title:"ক্রয়",add:"নতুন ক্রয়",invoice:"ক্রয় নম্বর",date:"ক্রয়ের তারিখ",supplier:"সাপ্লায়ার",total:"মোট",paid:"পরিশোধিত",due:"বাকি",noPurchases:"কোনো ক্রয় পাওয়া যায়নি",saved:"ক্রয় সফলভাবে সংরক্ষিত হয়েছে"},payments:{customerTitle:"কাস্টমারের পেমেন্ট",supplierTitle:"সাপ্লায়ারের পেমেন্ট",receivePayment:"পেমেন্ট গ্রহণ করুন",makePayment:"পেমেন্ট করুন",customer:"কাস্টমার",supplier:"সাপ্লায়ার",amount:"পরিমাণ",method:"পেমেন্টের মাধ্যম",reference:"রেফারেন্স নম্বর",account:"হিসাব",paymentDate:"পেমেন্টের তারিখ",recorded:"পেমেন্ট সফলভাবে রেকর্ড হয়েছে",methods:{cash:"নগদ",bank_transfer:"ব্যাংক ট্রান্সফার",cheque:"চেক",mobile_banking:"মোবাইল ব্যাংকিং"}},accounts:{title:"হিসাব",add:"হিসাব যোগ করুন",edit:"হিসাব সম্পাদনা",name:"হিসাবের নাম",type:"হিসাবের ধরন",balance:"ব্যালেন্স",statement:"স্টেটমেন্ট",deposit:"জমা",withdraw:"উত্তোলন",transfer:"ট্রান্সফার",transferTo:"যেখানে পাঠাবেন",amount:"পরিমাণ",description:"বিবরণ",totalCash:"মোট নগদ",totalBank:"মোট ব্যাংক",totalAvailable:"মোট উপলব্ধ",noAccounts:"কোনো হিসাব পাওয়া যায়নি",saved:"হিসাব সংরক্ষিত হয়েছে",deposited:"জমা রেকর্ড হয়েছে",withdrawn:"উত্তোলন রেকর্ড হয়েছে",transferred:"ট্রান্সফার সম্পন্ন হয়েছে",types:{cash:"নগদ",bank:"ব্যাংক",capital:"মূলধন"},txnTypes:{sale_payment:"বিক্রয় পেমেন্ট",purchase_payment:"ক্রয় পেমেন্ট",customer_payment:"কাস্টমার পেমেন্ট",supplier_payment:"সাপ্লায়ার পেমেন্ট",expense:"খরচ",transfer_in:"ট্রান্সফার গ্রহণ",transfer_out:"ট্রান্সফার প্রেরণ",deposit:"জমা",withdrawal:"উত্তোলন",opening:"প্রারম্ভিক ব্যালেন্স"}},expenses:{title:"খরচ",add:"খরচ যোগ করুন",category:"বিভাগ",account:"যে হিসাব থেকে",amount:"পরিমাণ",description:"বিবরণ",date:"খরচের তারিখ",noExpenses:"কোনো খরচ পাওয়া যায়নি",saved:"খরচ রেকর্ড হয়েছে"},reports:{title:"রিপোর্ট",profitLoss:"লাভ ও ক্ষতি",salesReport:"বিক্রয় রিপোর্ট",purchaseReport:"ক্রয় রিপোর্ট",stockReport:"স্টক রিপোর্ট",expenseReport:"খরচের রিপোর্ট",dateRange:"তারিখের পরিসর",generate:"রিপোর্ট তৈরি করুন",totalSales:"মোট বিক্রয়",totalPurchases:"মোট ক্রয়",totalExpenses:"মোট খরচ",grossProfit:"স্থূল লাভ",netProfit:"নিট লাভ",grossMargin:"স্থূল মার্জিন",netMargin:"নিট মার্জিন",income:"আয়",cogs:"পণ্যের ক্রয় মূল্য",expensesByCategory:"বিভাগ অনুযায়ী খরচ",noData:"এই সময়ের জন্য কোনো তথ্য নেই"},users:{title:"ব্যবহারকারী",add:"ব্যবহারকারী যোগ করুন",edit:"ব্যবহারকারী সম্পাদনা",username:"ব্যবহারকারীর নাম",fullName:"পুরো নাম",password:"পাসওয়ার্ড",role:"ভূমিকা",lastLogin:"শেষ লগইন",isActive:"সক্রিয়",resetPassword:"পাসওয়ার্ড রিসেট",newPassword:"নতুন পাসওয়ার্ড",saved:"ব্যবহারকারী সংরক্ষিত হয়েছে",passwordReset:"পাসওয়ার্ড সফলভাবে রিসেট হয়েছে",roles:{admin:"প্রশাসক",manager:"ম্যানেজার",cashier:"ক্যাশিয়ার"},roleDescriptions:{admin:"সব বিষয়ে সম্পূর্ণ অ্যাক্সেস",manager:"ব্যবহারকারী ব্যবস্থাপনা ছাড়া সব",cashier:"POS এবং সাধারণ কার্যক্রম"},deactivateConfirm:"এই ব্যবহারকারীকে নিষ্ক্রিয় করবেন?",noUsers:"কোনো ব্যবহারকারী পাওয়া যায়নি"},settings:{title:"সেটিংস",company:"প্রতিষ্ঠানের তথ্য",companyName:"প্রতিষ্ঠানের নাম",address:"ঠিকানা",phone:"ফোন",email:"ইমেইল",language:"ভাষা",currency:"মুদ্রার প্রতীক",saved:"সেটিংস সংরক্ষিত হয়েছে",invoiceSettings:"ইনভয়েস সেটিংস",invoicePrefix:"ইনভয়েস উপসর্গ"},confirm:{title:"আপনি কি নিশ্চিত?",irreversible:"এই কাজটি পূর্বাবস্থায় আনা যাবে না।",deleteItem:"এই আইটেমটি মুছবেন? এটি পূর্বাবস্থায় আনা যাবে না।",voidSale:"এই বিক্রয় বাতিল করবেন? স্টক ফেরত আসবে এবং এটি পূর্বাবস্থায় আনা যাবে না।",logout:"আপনাকে সিস্টেম থেকে লগআউট করা হবে।"},toast:{success:"সফল",error:"সমস্যা",warning:"সতর্কতা",info:"তথ্য",networkError:"নেটওয়ার্ক সমস্যা। সংযোগ পরীক্ষা করুন।",serverError:"সার্ভার সমস্যা। আবার চেষ্টা করুন।",unauthorized:"সেশন শেষ হয়েছে। আবার লগইন করুন।",forbidden:"এই কাজ করার অনুমতি নেই।"},validation:{required:"{field} আবশ্যক",minLength:"{field} কমপক্ষে {min} অক্ষরের হতে হবে",maxLength:"{field} সর্বোচ্চ {max} অক্ষরের হতে হবে",numeric:"{field} সঠিক সংখ্যা হতে হবে",positive:"{field} ধনাত্মক সংখ্যা হতে হবে",email:"সঠিক ইমেইল ঠিকানা দিন",passwordMismatch:"পাসওয়ার্ড মিলছে না"},table:{noResults:"কোনো ফলাফল পাওয়া যায়নি",showing:"{from}–{to} দেখাচ্ছে (মোট {total})",rowsPerPage:"প্রতি পাতায়",prev:"আগে",next:"পরে"}},lt={en:be,bn:ye};let G=localStorage.getItem("ct_lang")||"en";const Pt=new Set;function t(e,s={}){const n=lt[G]||lt.en,a=e.split(".");let o=n;for(const r of a)if(o&&typeof o=="object")o=o[r];else{o=void 0;break}if(o===void 0){o=lt.en;for(const r of a)if(o&&typeof o=="object")o=o[r];else{o=void 0;break}}return o===void 0||typeof o=="object"?e:String(o).replace(/\{(\w+)\}/g,(r,i)=>s[i]!==void 0?s[i]:`{${i}}`)}function st(){return G}function yt(e){lt[e]&&(G=e,localStorage.setItem("ct_lang",e),document.documentElement.lang=e,document.documentElement.setAttribute("data-lang",e),Pt.forEach(s=>s(e)))}function ge(e){return Pt.add(e),()=>Pt.delete(e)}function c(e){return"৳ "+(parseFloat(e)||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}function L(e){if(!e)return"—";try{return new Date(e).toLocaleDateString(G==="bn"?"bn-BD":"en-GB",{day:"2-digit",month:"short",year:"numeric"})}catch{return e}}function Bt(e){if(!e)return"—";try{return new Date(e).toLocaleString(G==="bn"?"bn-BD":"en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return e}}document.documentElement.lang=G;document.documentElement.setAttribute("data-lang",G);const N={user:null,settings:{},isLoading:!1},jt=new Map;function Ht(e,s){N[e]=s,(jt.get(e)||[]).forEach(n=>n(s)),(jt.get("*")||[]).forEach(n=>n({key:e,value:s}))}const q={get user(){return N.user},set user(e){Ht("user",e)},get settings(){return N.settings},set settings(e){Ht("settings",e)},isAuthenticated:()=>!!N.user,isAdmin:()=>{var e;return((e=N.user)==null?void 0:e.role)==="admin"},isManager:()=>{var e;return["admin","manager"].includes((e=N.user)==null?void 0:e.role)},isCashier:()=>!!N.user};function he(){var n,a;const e=localStorage.getItem("server_url");if(e&&e.trim()){let o=e.trim().replace(/\/$/,"");return o.endsWith("/api")||(o+="/api"),o}return((a=(n=window.Capacitor)==null?void 0:n.isNativePlatform)==null?void 0:a.call(n))||window.location.protocol==="file:"||window.location.hostname==="localhost"&&(!window.location.port||window.location.port==="80")?"http://192.168.0.144:5000/api":"/api"}class zt extends Error{constructor(s,n,a){super(s),this.status=n,this.data=a}}async function tt(e,s,n=null){const a=localStorage.getItem("ct_token"),o={"Content-Type":"application/json"};a&&(o.Authorization=`Bearer ${a}`);const r={method:e,credentials:"include",headers:o};n!==null&&(r.body=JSON.stringify(n));const i=he();let l;try{l=await fetch(`${i}${s}`,r)}catch{throw new zt("Network error — check Server URL or connection",0,null)}const d=(l.headers.get("content-type")||"").includes("json")?await l.json():await l.text();if(!l.ok){const u=(d==null?void 0:d.error)||(d==null?void 0:d.message)||`HTTP ${l.status}`;throw new zt(u,l.status,d)}return d}const v={get:e=>tt("GET",e),post:(e,s)=>tt("POST",e,s),put:(e,s)=>tt("PUT",e,s),patch:(e,s)=>tt("PATCH",e,s),delete:e=>tt("DELETE",e)},$t={login:(e,s)=>v.post("/auth/login",{username:e,password:s}),logout:()=>v.post("/auth/logout"),me:()=>v.get("/auth/me"),changePassword:e=>v.post("/auth/change-password",e)},K={list:()=>v.get("/users"),get:e=>v.get(`/users/${e}`),create:e=>v.post("/users",e),update:(e,s)=>v.put(`/users/${e}`,s),resetPassword:(e,s)=>v.post(`/users/${e}/reset-password`,{new_password:s})},nt={list:()=>v.get("/categories"),create:e=>v.post("/categories",e),update:(e,s)=>v.put(`/categories/${e}`,s),delete:e=>v.delete(`/categories/${e}`)},O={list:(e={})=>v.get("/products?"+new URLSearchParams(e)),search:e=>v.get(`/products/search?q=${encodeURIComponent(e)}`),get:e=>v.get(`/products/${e}`),create:e=>v.post("/products",e),update:(e,s)=>v.put(`/products/${e}`,s),delete:e=>v.delete(`/products/${e}`)},M={list:(e={})=>v.get("/customers?"+new URLSearchParams(e)),get:e=>v.get(`/customers/${e}`),ledger:(e,s={})=>v.get(`/customers/${e}/ledger?`+new URLSearchParams(s)),create:e=>v.post("/customers",e),update:(e,s)=>v.put(`/customers/${e}`,s),delete:e=>v.delete(`/customers/${e}`)},D={list:(e={})=>v.get("/suppliers?"+new URLSearchParams(e)),get:e=>v.get(`/suppliers/${e}`),ledger:(e,s={})=>v.get(`/suppliers/${e}/ledger?`+new URLSearchParams(s)),create:e=>v.post("/suppliers",e),update:(e,s)=>v.put(`/suppliers/${e}`,s),delete:e=>v.delete(`/suppliers/${e}`)},wt={list:(e={})=>v.get("/sales?"+new URLSearchParams(e)),get:e=>v.get(`/sales/${e}`),create:e=>v.post("/sales",e),void:(e,s)=>v.post(`/sales/${e}/void`,{void_reason:s})},Ct={list:(e={})=>v.get("/purchases?"+new URLSearchParams(e)),get:e=>v.get(`/purchases/${e}`),create:e=>v.post("/purchases",e)},Y={customerList:(e={})=>v.get("/payments/customers?"+new URLSearchParams(e)),customerCreate:e=>v.post("/payments/customers",e),supplierList:(e={})=>v.get("/payments/suppliers?"+new URLSearchParams(e)),supplierCreate:e=>v.post("/payments/suppliers",e)},T={list:()=>v.get("/accounts"),get:e=>v.get(`/accounts/${e}`),statement:(e,s={})=>v.get(`/accounts/${e}/statement?`+new URLSearchParams(s)),create:e=>v.post("/accounts",e),update:(e,s)=>v.put(`/accounts/${e}`,s),deposit:(e,s)=>v.post(`/accounts/${e}/deposit`,s),withdraw:(e,s)=>v.post(`/accounts/${e}/withdraw`,s),transfer:(e,s)=>v.post(`/accounts/${e}/transfer`,s)},xt={movements:(e={})=>v.get("/inventory/movements?"+new URLSearchParams(e)),lowStock:()=>v.get("/inventory/low-stock"),summary:()=>v.get("/inventory/summary"),adjust:e=>v.post("/inventory/adjust",e)},Tt={list:(e={})=>v.get("/expenses?"+new URLSearchParams(e)),categories:()=>v.get("/expenses/categories"),create:e=>v.post("/expenses",e),update:(e,s)=>v.put(`/expenses/${e}`,s)},ct={dashboard:()=>v.get("/reports/dashboard"),profitLoss:e=>v.get("/reports/profit-loss?"+new URLSearchParams(e)),sales:e=>v.get("/reports/sales?"+new URLSearchParams(e)),purchases:e=>v.get("/reports/purchases?"+new URLSearchParams(e))},Qt={get:()=>v.get("/settings"),update:e=>v.put("/settings",e)},Ot={export:()=>v.get("/backup/export"),import:e=>v.post("/backup/import",{backup:e})};function w({title:e,body:s,size:n="md",footer:a=[],closable:o=!0}){var d;const r=document.createElement("div");r.className="modal-overlay",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-label",e);const i=a.map((u,m)=>`
    <button class="btn ${u.class||"btn-secondary"}" data-action="${m}" id="modal-btn-${m}">
      ${u.label}
    </button>
  `).join("");r.innerHTML=`
    <div class="modal modal-${n}">
      <div class="modal-header">
        <span class="modal-title">${e}</span>
        ${o?`<button class="modal-close" aria-label="${t("app.close")}">✕</button>`:""}
      </div>
      <div class="modal-body"></div>
      ${a.length?`<div class="modal-footer">${i}</div>`:""}
    </div>
  `;const l=r.querySelector(".modal-body");typeof s=="string"?l.innerHTML=s:l.appendChild(s);const p=()=>{r.style.animation="fadeIn 0.15s ease reverse",setTimeout(()=>r.remove(),150)};return o&&((d=r.querySelector(".modal-close"))==null||d.addEventListener("click",p),r.addEventListener("click",u=>{u.target===r&&p()})),document.addEventListener("keydown",function u(m){m.key==="Escape"&&o&&(p(),document.removeEventListener("keydown",u))}),a.forEach((u,m)=>{var b;(b=r.querySelector(`[data-action="${m}"]`))==null||b.addEventListener("click",()=>{var h;(h=u.action)==null||h.call(u,{close:p})})}),document.body.appendChild(r),setTimeout(()=>{const u=r.querySelector(".modal-footer .btn")||r.querySelector(".modal-close");u==null||u.focus()},50),{el:r,close:p}}function R({title:e=t("confirm.title"),message:s,confirmLabel:n=t("app.confirm"),cancelLabel:a=t("app.cancel"),type:o="danger",details:r}){return new Promise(i=>{const l=`
      <div style="text-align:center; padding: 0.5rem 0;">
        <div style="font-size:2.5rem; margin-bottom:1rem; opacity:0.7;">
          ${o==="danger"?"⚠️":"❓"}
        </div>
        <p style="color: var(--text-primary); font-size:1rem; font-weight:500; margin-bottom:0.5rem;">
          ${s||t("confirm.irreversible")}
        </p>
        ${r?`<p style="color:var(--text-muted); font-size:0.8rem; margin-top:0.5rem;">${r}</p>`:""}
      </div>
    `,{close:p}=w({title:e,body:l,size:"sm",closable:!0,footer:[{label:a,class:"btn-secondary",action:({close:u})=>{u(),i(!1)}},{label:n,class:o==="danger"?"btn-danger":"btn-primary",action:({close:u})=>{u(),i(!0)}}]}),d=new MutationObserver(()=>{document.body.contains(p)||(i(!1),d.disconnect())})})}let W;function fe(){return W||(W=document.createElement("div"),W.className="toast-container",W.setAttribute("aria-live","polite"),document.body.appendChild(W)),W}const $e={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};function Yt(e,s,n=4e3){const a=fe(),o=document.createElement("div");o.className=`toast toast-${e}`,o.setAttribute("role","alert"),o.innerHTML=`
    <span class="toast-icon">${$e[e]||"ℹ"}</span>
    <div class="toast-body">
      <div class="toast-title">${t(`toast.${e}`)}</div>
      <div class="toast-message">${s}</div>
    </div>
    <button class="toast-close" aria-label="Close">✕</button>
  `;const r=()=>{o.classList.add("exiting"),setTimeout(()=>o.remove(),250)};return o.querySelector(".toast-close").addEventListener("click",r),a.appendChild(o),n>0&&setTimeout(r,n),{dismiss:r}}const $=(e,s)=>Yt("success",e,s),y=(e,s)=>Yt("error",e,s);function f(e){e.status===0?y(t("toast.networkError")):e.status===401?(y(t("toast.unauthorized")),setTimeout(()=>{window.location.hash="/login"},1500)):e.status===403?y(t("toast.forbidden")):e.status>=500?y(t("toast.serverError")):y(e.message||t("toast.serverError"))}const we=[{label:()=>"",items:[{key:"dashboard",icon:"⊞",path:"/",label:()=>t("nav.dashboard")},{key:"pos",icon:"🛒",path:"/pos",label:()=>t("nav.pos")}]},{label:()=>t("nav.sales"),items:[{key:"sales",icon:"📋",path:"/sales",label:()=>t("nav.sales")},{key:"purchases",icon:"📦",path:"/purchases",label:()=>t("nav.purchases")},{key:"customers",icon:"👥",path:"/customers",label:()=>t("nav.customers")},{key:"suppliers",icon:"🏭",path:"/suppliers",label:()=>t("nav.suppliers")}]},{label:()=>t("nav.payments"),items:[{key:"customer-payments",icon:"💰",path:"/payments/customers",label:()=>t("nav.customerPayments")},{key:"supplier-payments",icon:"💸",path:"/payments/suppliers",label:()=>t("nav.supplierPayments")}]},{label:()=>t("nav.inventory"),items:[{key:"products",icon:"📦",path:"/products",label:()=>t("nav.products")},{key:"inventory",icon:"📊",path:"/inventory",label:()=>t("nav.inventory")},{key:"expenses",icon:"💳",path:"/expenses",label:()=>t("nav.expenses")},{key:"accounts",icon:"🏦",path:"/accounts",label:()=>t("nav.accounts")}]},{label:()=>t("nav.reports"),items:[{key:"reports",icon:"📈",path:"/reports",label:()=>t("nav.reports")}]}],xe=[{key:"users",icon:"👤",path:"/users",label:()=>t("nav.users")},{key:"settings",icon:"⚙",path:"/settings",label:()=>t("nav.settings")}];function Ee(e){e.innerHTML=`
    <aside class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">CT</div>
        <div class="sidebar-logo-text">
          <div class="sidebar-logo-title" id="shell-app-name">${t("app.name")}</div>
          <div class="sidebar-logo-sub" id="shell-company">${t("app.company")}</div>
        </div>
      </div>
      <nav class="sidebar-nav" id="sidebar-nav"></nav>
      <div class="sidebar-footer">
        <div id="sidebar-user-info" style="margin-bottom:0.5rem; font-size:0.78rem; color:var(--text-muted);"></div>
        <button class="btn btn-ghost btn-sm btn-full" id="logout-btn">
          🚪 <span id="logout-label">${t("auth.logout")}</span>
        </button>
      </div>
    </aside>

    <div class="mobile-overlay" id="mobile-overlay"></div>

    <div class="topbar" id="topbar">
      <div class="topbar-left">
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">☰</button>
        <span class="topbar-title" id="topbar-title"></span>
      </div>
      <div class="topbar-right">
        <div class="lang-switcher" role="group" aria-label="Language">
          <button class="lang-btn ${st()==="en"?"active":""}" id="lang-en" data-lang="en">EN</button>
          <button class="lang-btn ${st()==="bn"?"active":""}" id="lang-bn" data-lang="bn">বাং</button>
        </div>
        <div class="user-menu">
          <button class="user-btn" id="user-btn" aria-haspopup="true">
            <div class="user-avatar" id="user-avatar">?</div>
            <span id="user-name" style="font-size:0.8rem;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
            <span style="font-size:0.7rem;color:var(--text-muted);">▾</span>
          </button>
        </div>
      </div>
    </div>

    <main class="main-content" id="main-content">
      <div id="page-outlet" class="page"></div>
    </main>
  `,It(),ke(),Ft(),ge(()=>{It(),document.getElementById("shell-app-name").textContent=t("app.name"),document.getElementById("shell-company").textContent=t("app.company"),document.getElementById("logout-label").textContent=t("auth.logout"),Ft()})}function It(){const e=document.getElementById("sidebar-nav");if(!e)return;const s=window.location.hash.slice(1)||"/",n=q.user;let a="";for(const o of we){o.label()&&(a+=`<div class="sidebar-section-label">${o.label()}</div>`);for(const r of o.items){const i=s===r.path||r.path!=="/"&&s.startsWith(r.path);a+=`
        <div class="nav-item ${i?"active":""}" data-path="${r.path}" role="link" tabindex="0">
          <span class="nav-icon">${r.icon}</span>
          <span class="nav-label">${r.label()}</span>
        </div>
      `}}if((n==null?void 0:n.role)==="admin"||(n==null?void 0:n.role)==="manager"){a+=`<div class="sidebar-section-label">${t("nav.settings")}</div>`;for(const o of xe){if(o.key==="users"&&(n==null?void 0:n.role)!=="admin")continue;const r=s===o.path;a+=`
        <div class="nav-item ${r?"active":""}" data-path="${o.path}" role="link" tabindex="0">
          <span class="nav-icon">${o.icon}</span>
          <span class="nav-label">${o.label()}</span>
        </div>
      `}}e.innerHTML=a,e.querySelectorAll(".nav-item").forEach(o=>{o.addEventListener("click",()=>{B(o.dataset.path),Xt()}),o.addEventListener("keydown",r=>{r.key==="Enter"&&o.click()})})}function Ft(){const e=q.user;if(!e)return;const s=document.getElementById("user-avatar"),n=document.getElementById("user-name"),a=document.getElementById("sidebar-user-info"),o=e.full_name.split(" ").map(r=>r[0]).slice(0,2).join("").toUpperCase();s&&(s.textContent=o),n&&(n.textContent=e.full_name),a&&(a.textContent=`${e.full_name} (${e.role})`)}function ke(){var e,s,n,a,o;(e=document.getElementById("lang-en"))==null||e.addEventListener("click",()=>Nt("en")),(s=document.getElementById("lang-bn"))==null||s.addEventListener("click",()=>Nt("bn")),(n=document.getElementById("mobile-menu-btn"))==null||n.addEventListener("click",_e),(a=document.getElementById("mobile-overlay"))==null||a.addEventListener("click",Xt),(o=document.getElementById("logout-btn"))==null||o.addEventListener("click",async()=>{await R({title:t("auth.logout"),message:t("confirm.logout"),type:"warning",confirmLabel:t("auth.logout")})&&(await $t.logout().catch(()=>{}),localStorage.removeItem("ct_token"),q.user=null,B("/login"))}),window.addEventListener("hashchange",()=>It())}function Nt(e){yt(e),document.querySelectorAll(".lang-btn").forEach(s=>{s.classList.toggle("active",s.dataset.lang===e)})}function _e(){var e,s;(e=document.getElementById("sidebar"))==null||e.classList.toggle("mobile-open"),(s=document.getElementById("mobile-overlay"))==null||s.classList.toggle("active")}function Xt(){var e,s;(e=document.getElementById("sidebar"))==null||e.classList.remove("mobile-open"),(s=document.getElementById("mobile-overlay"))==null||s.classList.remove("active")}function _(e){const s=document.getElementById("topbar-title");s&&(s.textContent=e)}function Se(){return document.getElementById("page-outlet")}async function qt(e){var a,o,r,i,l,p,d;const s=localStorage.getItem("server_url")||"";e.innerHTML=`
    <div style="position:relative; width:100%; min-height:100vh; min-height:100dvh; display:flex; align-items:center; justify-content:center;
         background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 60%, #020617 100%);
         padding: 1.5rem 1rem; overflow:hidden;">

      <!-- Decorative Ambient Lights (contained inside overflow:hidden) -->
      <div style="position:absolute; width:350px; height:350px; border-radius:50%;
           background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
           top: -80px; right: -80px; pointer-events:none; filter:blur(40px);"></div>
      <div style="position:absolute; width:300px; height:300px; border-radius:50%;
           background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%);
           bottom: -60px; left: -60px; pointer-events:none; filter:blur(40px);"></div>

      <div style="width:100%; max-width:400px; margin:0 auto; position:relative; z-index:1;">
        <!-- Logo & Header -->
        <div style="text-align:center; margin-bottom:1.75rem;">
          <div style="width:64px; height:64px; background: linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%);
               border-radius:20px; display:flex; align-items:center; justify-content:center;
               margin:0 auto 1rem; font-size:1.6rem; font-weight:800; color:white;
               box-shadow: 0 10px 30px -5px rgba(99,102,241,0.5), inset 0 1px 1px rgba(255,255,255,0.4);
               letter-spacing:-0.05em;">CT</div>
          <h1 style="font-size:1.6rem; font-weight:700; color:#f8fafc; margin:0 0 0.25rem 0; letter-spacing:-0.025em;" id="login-title">
            ${t("app.name")}
          </h1>
          <p style="color:#94a3b8; font-size:0.875rem; margin:0;" id="login-company">${t("app.company")}</p>
        </div>

        <!-- Glassmorphism Card -->
        <div style="background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
             border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.25rem;
             padding: 1.75rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);">

          <!-- Language Switcher Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <span style="font-size:0.85rem; font-weight:600; color:#cbd5e1;">${t("auth.login")}</span>
            <div class="lang-switcher" style="background:rgba(15,23,42,0.6); padding:3px; border-radius:9999px; border:1px solid rgba(255,255,255,0.08);">
              <button class="lang-btn ${st()==="en"?"active":""}" data-lang="en" id="login-lang-en" style="padding:3px 10px; font-size:0.75rem;">EN</button>
              <button class="lang-btn ${st()==="bn"?"active":""}" data-lang="bn" id="login-lang-bn" style="padding:3px 10px; font-size:0.75rem;">বাং</button>
            </div>
          </div>

          <form id="login-form" novalidate>
            <!-- Username Input -->
            <div class="form-group" style="margin-bottom:1.15rem;">
              <label class="form-label" for="login-username" id="label-username" style="font-size:0.825rem; font-weight:500; color:#cbd5e1; margin-bottom:0.4rem; display:block;">
                ${t("auth.username")} <span class="required-star">*</span>
              </label>
              <div style="position:relative;">
                <span style="position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#64748b; display:flex; pointer-events:none;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input type="text" id="login-username" name="username" class="form-control"
                  autocomplete="username" autocapitalize="none" spellcheck="false"
                  placeholder="${t("auth.username")}" required
                  style="padding-left:2.6rem; height:44px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); border-radius:0.75rem; color:#f8fafc; font-size:0.9rem;" />
              </div>
            </div>

            <!-- Password Input -->
            <div class="form-group" style="margin-bottom:1.15rem;">
              <label class="form-label" for="login-password" id="label-password" style="font-size:0.825rem; font-weight:500; color:#cbd5e1; margin-bottom:0.4rem; display:block;">
                ${t("auth.password")} <span class="required-star">*</span>
              </label>
              <div style="position:relative;">
                <span style="position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#64748b; display:flex; pointer-events:none;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input type="password" id="login-password" name="password" class="form-control"
                  autocomplete="current-password" placeholder="••••••••" required
                  style="padding-left:2.6rem; padding-right:2.6rem; height:44px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); border-radius:0.75rem; color:#f8fafc; font-size:0.9rem;" />
                <button type="button" id="toggle-password" title="Toggle password visibility"
                  style="position:absolute; right:0.75rem; top:50%; transform:translateY(-50%);
                         background:none; border:none; color:#64748b; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; border-radius:0.375rem;">
                  <svg id="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>

            <!-- Mobile / Server Config Drawer Toggle -->
            <div style="margin-bottom:1.25rem;">
              <button type="button" id="toggle-server-settings"
                style="background:none; border:none; color:#818cf8; font-size:0.8rem; font-weight:500; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; padding:0;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span>${t("auth.serverUrl")}</span>
              </button>

              <div id="server-settings-panel" style="display:${s?"block":"none"}; margin-top:0.75rem; padding:0.85rem; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:0.75rem;">
                <label for="login-server-url" style="color:#94a3b8; font-size:0.75rem; font-weight:500; display:block; margin-bottom:0.35rem;">
                  Backend Host URL (IP / Domain)
                </label>
                <input type="text" id="login-server-url" class="form-control"
                  placeholder="http://192.168.0.144:5000"
                  value="${s}"
                  style="height:38px; font-size:0.8rem; background:rgba(30,41,59,0.8); border:1px solid rgba(255,255,255,0.12); border-radius:0.5rem; color:#f8fafc;" />
                <small style="color:#64748b; font-size:0.725rem; display:block; margin-top:0.35rem; line-height:1.3;">
                  ${t("auth.serverUrlHint")}
                </small>
              </div>
            </div>

            <!-- Error Banner -->
            <div id="login-error" style="display:none; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4);
                 color:#fca5a5; padding:0.75rem; border-radius:0.75rem; font-size:0.825rem;
                 margin-bottom:1.15rem; align-items:center; gap:0.5rem;"></div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-full" id="login-btn"
              style="height:46px; border-radius:0.75rem; font-size:0.95rem; font-weight:600; background:linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border:none; box-shadow:0 4px 15px rgba(99,102,241,0.4);">
              ${t("auth.loginBtn")}
            </button>
          </form>
        </div>

        <p style="text-align:center; margin-top:1.5rem; color:#475569; font-size:0.75rem; font-weight:500;">
          CoreTrade ERP v1.0 · Islam Enterprise
        </p>
      </div>
    </div>
  `,(a=document.getElementById("login-lang-en"))==null||a.addEventListener("click",()=>{yt("en"),qt(e)}),(o=document.getElementById("login-lang-bn"))==null||o.addEventListener("click",()=>{yt("bn"),qt(e)}),(r=document.getElementById("toggle-server-settings"))==null||r.addEventListener("click",()=>{var m;const u=document.getElementById("server-settings-panel");u&&(u.style.display=u.style.display==="none"?"block":"none",u.style.display==="block"&&((m=document.getElementById("login-server-url"))==null||m.focus()))});let n=!1;(i=document.getElementById("toggle-password"))==null||i.addEventListener("click",()=>{n=!n;const u=document.getElementById("login-password"),m=document.getElementById("eye-icon");u&&(u.type=n?"text":"password"),m&&(m.innerHTML=n?'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>':'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>')}),(l=document.getElementById("login-form"))==null||l.addEventListener("submit",async u=>{u.preventDefault();const m=document.getElementById("login-btn"),b=document.getElementById("login-error"),h=document.getElementById("login-username").value.trim(),g=document.getElementById("login-password").value,C=document.getElementById("login-server-url");if(C&&C.value.trim()?localStorage.setItem("server_url",C.value.trim()):localStorage.removeItem("server_url"),!h||!g){b.style.display="flex",b.innerHTML=`<span>⚠️</span> <span>${t("auth.invalidCredentials")}</span>`;return}m.classList.add("loading"),m.disabled=!0,m.textContent=t("auth.loggingIn"),b.style.display="none";try{const A=await $t.login(h,g);A.token&&localStorage.setItem("ct_token",A.token),q.user=A.user,B("/")}catch(A){b.style.display="flex",b.innerHTML=`<span>⚠️</span> <span>${A.message||t("auth.invalidCredentials")}</span>`,m.classList.remove("loading"),m.disabled=!1,m.textContent=t("auth.loginBtn"),document.getElementById("login-password").value=""}}),(p=document.getElementById("login-username"))==null||p.focus(),(d=document.getElementById("initial-loader"))==null||d.remove()}async function Le(e){var s,n;_(t("dashboard.title")),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("dashboard.title")}</h1>
      <span style="color:var(--text-muted); font-size:0.8rem;" id="dash-date"></span>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions" id="quick-actions">
      ${Pe()}
    </div>

    <!-- Stats Grid (skeleton) -->
    <div class="stats-grid" id="stats-grid">
      ${[...Array(8)].map(()=>`
        <div class="stat-card">
          <div class="skeleton" style="height:14px; width:60%; margin-bottom:12px; border-radius:4px;"></div>
          <div class="skeleton" style="height:32px; width:80%; border-radius:4px;"></div>
        </div>
      `).join("")}
    </div>

    <!-- Bottom row -->
    <div class="grid-2" style="gap:1.5rem;">
      <div class="card" id="recent-sales-card">
        <div class="card-header">
          <span class="card-title">${t("dashboard.recentSales")}</span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('/sales')">${t("app.view")}</button>
        </div>
        <div class="loading-spinner"><div class="spinner"></div></div>
      </div>

      <div class="card" id="low-stock-card">
        <div class="card-header">
          <span class="card-title">${t("dashboard.lowStockAlert")}</span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('/inventory')">${t("inventory.lowStock")}</button>
        </div>
        <div class="loading-spinner"><div class="spinner"></div></div>
      </div>
    </div>
  `,document.getElementById("dash-date").textContent=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),document.querySelectorAll("[data-qa-path]").forEach(a=>{a.addEventListener("click",()=>B(a.dataset.qaPath))});try{const{today:a,customer_due:o,supplier_due:r,total_cash:i,total_bank:l,total_available:p,low_stock_count:d,recent_sales:u}=await ct.dashboard(),m=document.getElementById("stats-grid");m.innerHTML=`
      ${j(t("dashboard.todaySales"),c(a.sales),`${a.sale_count} ${t("nav.sales")}`,"#6366f1","💰")}
      ${j(t("dashboard.todayPurchases"),c(a.purchases),`${a.purchase_count} ${t("nav.purchases")}`,"#f59e0b","📦")}
      ${j(t("dashboard.todayExpenses"),c(a.expenses),"","#ef4444","💳")}
      ${j(t("dashboard.todayProfit"),c(a.profit),"",a.profit>=0?"#10b981":"#ef4444","📈")}
      ${j(t("dashboard.cashBalance"),c(i),"","#10b981","💵")}
      ${j(t("dashboard.bankBalance"),c(l),t("dashboard.totalAvailable")+": "+c(p),"#0ea5e9","🏦")}
      ${j(t("dashboard.customerDue"),c(o),"","#f59e0b","👥")}
      ${j(t("dashboard.supplierDue"),c(r),"","#ef4444","🏭")}
    `;const b=document.getElementById("recent-sales-card");b.innerHTML=`
      <div class="card-header">
        <span class="card-title">${t("dashboard.recentSales")}</span>
        <button class="btn btn-ghost btn-sm" id="view-all-sales">${t("app.view")}</button>
      </div>
      ${u.length===0?`
        <div class="empty-state" style="padding:2rem;">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">${t("dashboard.noRecentSales")}</div>
        </div>
      `:`
        <table class="table">
          <thead><tr>
            <th>${t("sales.invoice")}</th>
            <th>${t("sales.customer")}</th>
            <th>${t("sales.type")}</th>
            <th class="text-right">${t("sales.total")}</th>
          </tr></thead>
          <tbody>
            ${u.map(g=>`
              <tr>
                <td style="font-family:monospace; font-size:0.8rem;">${g.invoice_no}</td>
                <td>${g.customer_name||"—"}</td>
                <td><span class="badge ${g.sale_type==="cash"?"badge-success":"badge-warning"}">
                  ${t(`sales.types.${g.sale_type}`)}
                </span></td>
                <td class="text-right amount">${c(g.total)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `}
    `,(s=document.getElementById("view-all-sales"))==null||s.addEventListener("click",()=>B("/sales"));const h=document.getElementById("low-stock-card");d===0?h.innerHTML=`
        <div class="card-header"><span class="card-title">${t("dashboard.lowStockAlert")}</span></div>
        <div class="empty-state" style="padding:2rem;">
          <div class="empty-state-icon">✅</div>
          <div class="empty-state-title" style="color:var(--color-success);">All stock levels OK</div>
        </div>
      `:(h.innerHTML=`
        <div class="card-header">
          <span class="card-title">${t("dashboard.lowStockAlert")}</span>
          <span class="badge badge-warning">${t("dashboard.lowStockItems").replace("{n}",d)}</span>
        </div>
        <div style="padding:1rem; text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">⚠️</div>
          <div style="font-weight:600; color:var(--color-warning); margin-bottom:1rem;">
            ${t("dashboard.lowStockItems").replace("{n}",d)}
          </div>
          <button class="btn btn-warning btn-sm" id="view-low-stock">${t("dashboard.viewLowStock")}</button>
        </div>
      `,(n=document.getElementById("view-low-stock"))==null||n.addEventListener("click",()=>B("/inventory?tab=low-stock")))}catch(a){f(a)}}function j(e,s,n,a,o){return`
    <div class="stat-card" style="--card-accent:${a};">
      <div class="stat-label">${e}</div>
      <div class="stat-value">${s}</div>
      ${n?`<div class="stat-sub">${n}</div>`:""}
      <div class="stat-icon">${o}</div>
    </div>
  `}function Pe(){return[{icon:"🛒",label:()=>t("quick.newSale"),path:"/pos"},{icon:"📦",label:()=>t("quick.newPurchase"),path:"/purchases/new"},{icon:"💰",label:()=>t("quick.receivePayment"),path:"/payments/customers/new"},{icon:"💸",label:()=>t("quick.paySupplier"),path:"/payments/suppliers/new"},{icon:"💳",label:()=>t("quick.addExpense"),path:"/expenses/new"},{icon:"📦",label:()=>t("quick.addProduct"),path:"/products/new"}].map(s=>`
    <button class="quick-action-btn" data-qa-path="${s.path}">
      <span class="qa-icon">${s.icon}</span>
      ${s.label()}
    </button>
  `).join("")}let k=[],Ut=[],Vt=[];async function Te(e){_(t("pos.title")),k=[],e.innerHTML=`
    <div class="pos-layout">
      <!-- Left: Product Search + Results -->
      <div class="pos-products">
        <div class="pos-search">
          <div class="search-input-wrapper" style="max-width:100%;">
            <span class="search-icon">🔍</span>
            <input type="text" id="pos-search" class="form-control"
              placeholder="${t("pos.searchProduct")}"
              autocomplete="off" autocorrect="off" spellcheck="false" />
          </div>
        </div>
        <div class="pos-product-results" id="pos-results">
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-title">${t("pos.searchProduct")}</div>
          </div>
        </div>
      </div>

      <!-- Right: Cart -->
      <div class="pos-cart">
        <div class="cart-header">
          <span style="font-weight:600; color:var(--text-primary);">
            🛒 ${t("pos.cart")}
          </span>
          <button class="btn btn-ghost btn-sm" id="clear-cart-btn">🗑 ${t("pos.clearCart")}</button>
        </div>

        <div class="cart-items" id="cart-items">
          <div class="empty-state" id="cart-empty">
            <div class="empty-state-icon">🛒</div>
            <div class="empty-state-text">${t("pos.emptyCart")}</div>
          </div>
        </div>

        <div class="cart-summary" id="cart-summary">
          <!-- Sale type -->
          <div class="form-group" style="margin-bottom:0.75rem;">
            <label class="form-label">${t("pos.saleType")}</label>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-sm sale-type-btn active" data-type="cash" id="type-cash">💵 ${t("pos.cashSale")}</button>
              <button class="btn btn-sm sale-type-btn" data-type="credit" id="type-credit">📋 ${t("pos.creditSale")}</button>
              <button class="btn btn-sm sale-type-btn" data-type="wholesale" id="type-wholesale">📦 ${t("pos.wholesaleSale")}</button>
            </div>
          </div>

          <!-- Customer (shown for credit) -->
          <div class="form-group" id="customer-group" style="display:none; margin-bottom:0.75rem;">
            <label class="form-label">${t("pos.selectCustomer")} <span class="required-star">*</span></label>
            <select class="form-control" id="pos-customer">
              <option value="">${t("app.selectOption")}</option>
            </select>
          </div>

          <!-- Account -->
          <div class="form-group" style="margin-bottom:0.75rem;">
            <label class="form-label">${t("pos.paymentAccount")}</label>
            <select class="form-control" id="pos-account">
              <option value="">${t("app.selectOption")}</option>
            </select>
          </div>

          <!-- Totals -->
          <div style="border-top:1px solid var(--border); padding-top:0.75rem; margin-bottom:0.75rem;">
            <div class="cart-summary-row">
              <span>${t("app.subtotal")}</span>
              <span class="text-taka" id="summary-subtotal">৳ 0.00</span>
            </div>
            <div class="cart-summary-row">
              <span>${t("app.discount")}</span>
              <input type="number" id="cart-discount" class="form-control"
                style="width:100px; text-align:right; padding:2px 8px; height:28px;"
                value="0" min="0" step="0.01" />
            </div>
            <div class="cart-summary-row total">
              <span>${t("app.total")}</span>
              <span class="text-taka" id="summary-total">৳ 0.00</span>
            </div>
          </div>

          <!-- Payment -->
          <div class="form-group" style="margin-bottom:0.75rem;">
            <label class="form-label">${t("pos.amountPaid")}</label>
            <input type="number" id="amount-paid" class="form-control"
              value="0" min="0" step="0.01" />
          </div>

          <div class="cart-summary-row" style="font-size:0.875rem;">
            <span>${t("pos.changeDue")}</span>
            <span id="summary-change" class="text-taka" style="color:var(--color-success);">৳ 0.00</span>
          </div>

          <div class="cart-summary-row" style="font-size:0.875rem;">
            <span>${t("app.due")}</span>
            <span id="summary-due" class="text-taka" style="color:var(--color-warning);">৳ 0.00</span>
          </div>

          <!-- Notes -->
          <div class="form-group" style="margin-bottom:1rem; margin-top:0.5rem;">
            <textarea id="pos-notes" class="form-control"
              placeholder="${t("app.notes")} (${t("app.optional")})"
              rows="2" style="resize:none;"></textarea>
          </div>

          <button class="btn btn-success btn-full btn-lg" id="complete-sale-btn">
            ✓ ${t("pos.completeSale")}
          </button>
        </div>
      </div>
    </div>
  `,await Ie(),qe()}async function Ie(){try{const[e,s]=await Promise.all([M.list({limit:500}),T.list()]);Ut=e.customers||[],Vt=(s.accounts||[]).filter(o=>o.type!=="capital");const n=document.getElementById("pos-customer"),a=document.getElementById("pos-account");n&&Ut.forEach(o=>{const r=document.createElement("option");r.value=o.id,r.textContent=`${o.name}${o.phone?` (${o.phone})`:""} — ${t("app.due")}: ${c(o.balance)}`,n.appendChild(r)}),a&&Vt.forEach(o=>{const r=document.createElement("option");r.value=o.id,r.textContent=`${o.name} — ${c(o.balance)}`,o.is_default&&(r.selected=!0),a.appendChild(r)})}catch(e){f(e)}}function qe(){var s,n,a,o,r,i;let e;(s=document.getElementById("pos-search"))==null||s.addEventListener("input",l=>{clearTimeout(e);const p=l.target.value.trim();if(p.length<1){At();return}e=setTimeout(()=>Be(p),200)}),document.querySelectorAll(".sale-type-btn").forEach(l=>{l.addEventListener("click",()=>{document.querySelectorAll(".sale-type-btn").forEach(u=>{u.classList.remove("active","btn-primary","btn-warning","btn-secondary"),u.classList.add("btn-secondary")}),l.classList.add("active","btn-primary"),l.classList.remove("btn-secondary");const p=l.dataset.type,d=document.getElementById("customer-group");d&&(d.style.display=p==="credit"?"block":"none"),H()})}),(n=document.getElementById("type-cash"))==null||n.classList.add("btn-primary"),document.querySelectorAll(".sale-type-btn:not(#type-cash)").forEach(l=>l.classList.add("btn-secondary")),(a=document.getElementById("cart-discount"))==null||a.addEventListener("input",H),(o=document.getElementById("amount-paid"))==null||o.addEventListener("input",H),(r=document.getElementById("clear-cart-btn"))==null||r.addEventListener("click",async()=>{if(k.length===0)return;await R({message:t("pos.clearCartConfirm"),type:"warning"})&&(k=[],Et())}),(i=document.getElementById("complete-sale-btn"))==null||i.addEventListener("click",Ae)}async function Be(e){const s=document.getElementById("pos-results");if(s){s.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>';try{const{products:n}=await O.search(e);if(!n.length){s.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">${t("app.noData")}</div>
        </div>
      `;return}s.innerHTML=n.map(a=>`
      <div class="pos-product-card" data-product='${JSON.stringify(a)}'>
        <div class="pos-product-name">${a.name}</div>
        ${a.sku?`<div class="pos-product-sku">${a.sku}${a.brand?` · ${a.brand}`:""}${a.size?` · ${a.size}`:""}</div>`:""}
        <div class="pos-product-price">${c(a.retail_price)}</div>
        <div class="pos-product-stock ${parseFloat(a.current_stock)<=0?"low":""}">
          ${t("inventory.movementTypes.opening")}: ${a.current_stock} ${a.unit}
        </div>
      </div>
    `).join(""),s.querySelectorAll(".pos-product-card").forEach(a=>{a.addEventListener("click",()=>{const o=JSON.parse(a.dataset.product);Ce(o)})})}catch(n){f(n),At()}}}function At(){const e=document.getElementById("pos-results");e&&(e.innerHTML=`
    <div class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-title">${t("pos.searchProduct")}</div>
    </div>
  `)}function Ce(e){var a;const s=k.find(o=>o.product_id===e.id);if(s)s.qty=parseFloat(s.qty)+1;else{const r=(((a=document.querySelector(".sale-type-btn.active"))==null?void 0:a.dataset.type)||"cash")==="wholesale"?e.wholesale_price:e.retail_price;k.push({product_id:e.id,name:e.name,sku:e.sku,unit:e.unit,unit_price:parseFloat(r),qty:1,discount:0,max_stock:parseFloat(e.current_stock)})}Et();const n=document.getElementById("pos-search");n&&(n.value="",n.focus()),At()}function Et(){const e=document.getElementById("cart-items");if(document.getElementById("cart-empty"),!!e){if(k.length===0){e.innerHTML=`
      <div class="empty-state" id="cart-empty">
        <div class="empty-state-icon">🛒</div>
        <div class="empty-state-text">${t("pos.emptyCart")}</div>
      </div>
    `,H();return}e.innerHTML=k.map((s,n)=>`
    <div class="cart-item" data-idx="${n}">
      <div class="cart-item-name">${s.name}</div>
      <div class="cart-item-controls">
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted);">${t("pos.qty")} (${s.unit})</label>
          <input type="number" class="form-control item-qty"
            data-idx="${n}" value="${s.qty}"
            min="0.001" max="${s.max_stock}" step="0.001"
            style="width:90px; height:30px; padding:2px 8px;" />
        </div>
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted);">${t("pos.unitPrice")}</label>
          <input type="number" class="form-control item-price"
            data-idx="${n}" value="${s.unit_price}"
            min="0" step="0.01"
            style="width:100px; height:30px; padding:2px 8px;" />
        </div>
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted);">${t("pos.itemDiscount")}</label>
          <input type="number" class="form-control item-discount"
            data-idx="${n}" value="${s.discount}"
            min="0" step="0.01"
            style="width:80px; height:30px; padding:2px 8px;" />
        </div>
        <span class="cart-item-total" id="item-total-${n}">
          ${c(s.qty*s.unit_price-s.discount)}
        </span>
        <button class="btn btn-ghost btn-sm item-remove" data-idx="${n}"
          title="${t("pos.removeItem")}">✕</button>
      </div>
    </div>
  `).join(""),e.querySelectorAll(".item-qty").forEach(s=>{s.addEventListener("input",n=>{const a=parseInt(n.target.dataset.idx);k[a].qty=parseFloat(n.target.value)||0,_t(a),H()})}),e.querySelectorAll(".item-price").forEach(s=>{s.addEventListener("input",n=>{const a=parseInt(n.target.dataset.idx);k[a].unit_price=parseFloat(n.target.value)||0,_t(a),H()})}),e.querySelectorAll(".item-discount").forEach(s=>{s.addEventListener("input",n=>{const a=parseInt(n.target.dataset.idx);k[a].discount=parseFloat(n.target.value)||0,_t(a),H()})}),e.querySelectorAll(".item-remove").forEach(s=>{s.addEventListener("click",n=>{const a=parseInt(n.currentTarget.dataset.idx);k.splice(a,1),Et()})}),H()}}function _t(e){const s=k[e],n=Math.max(0,s.qty*s.unit_price-s.discount),a=document.getElementById(`item-total-${e}`);a&&(a.textContent=c(n))}function H(){var l,p;const e=k.reduce((d,u)=>d+Math.max(0,u.qty*u.unit_price-u.discount),0),s=parseFloat((l=document.getElementById("cart-discount"))==null?void 0:l.value)||0,n=Math.max(0,e-s),a=parseFloat((p=document.getElementById("amount-paid"))==null?void 0:p.value)||0,o=Math.max(0,a-n),r=Math.max(0,n-a),i=(d,u)=>{const m=document.getElementById(d);m&&(m.textContent=u)};i("summary-subtotal",c(e)),i("summary-total",c(n)),i("summary-change",c(o)),i("summary-due",c(r))}async function Ae(){var l,p,d,u,m,b,h;if(k.length===0){y(t("pos.itemsRequired"));return}for(const g of k){if(!g.unit_price||g.unit_price<=0){y(t("pos.unitPriceRequired"));return}if(!g.qty||g.qty<=0){y(`${t("pos.qty")} required`);return}}const e=((l=document.querySelector(".sale-type-btn.active"))==null?void 0:l.dataset.type)||"cash",s=(p=document.getElementById("pos-customer"))==null?void 0:p.value,n=(d=document.getElementById("pos-account"))==null?void 0:d.value;if(e==="credit"&&!s){y(t("pos.customerRequired"));return}if(!n&&e!=="credit"){y(t("pos.accountRequired"));return}const a=parseFloat((u=document.getElementById("cart-discount"))==null?void 0:u.value)||0,o=parseFloat((m=document.getElementById("amount-paid"))==null?void 0:m.value)||0,r=(b=document.getElementById("pos-notes"))==null?void 0:b.value;for(const g of k)if(g.qty>g.max_stock){y(`${t("pos.insufficientStock")} "${g.name}". ${t("pos.available")}: ${g.max_stock} ${g.unit}`);return}const i=document.getElementById("complete-sale-btn");i&&(i.disabled=!0,i.textContent=t("pos.completingLoading"));try{const g={sale_type:e,customer_id:s||void 0,account_id:n||void 0,items:k.map(rt=>({product_id:rt.product_id,qty:rt.qty,unit_price:rt.unit_price,discount:rt.discount})),discount:a,paid:o,notes:r},{sale:C,message:A}=await wt.create(g);$(`${t("pos.saleSuccess")} · ${t("pos.invoiceNo")}: ${C.invoice_no}`),k=[],Et(),document.getElementById("cart-discount")&&(document.getElementById("cart-discount").value="0"),document.getElementById("amount-paid")&&(document.getElementById("amount-paid").value="0"),document.getElementById("pos-notes")&&(document.getElementById("pos-notes").value=""),(h=document.getElementById("pos-search"))==null||h.focus()}catch(g){y(g.message||t("toast.serverError"))}finally{i&&(i.disabled=!1,i.textContent=`✓ ${t("pos.completeSale")}`)}}let St=[],Zt=[],Q=1,Gt=0,dt={search:"",category_id:"",low_stock:""};async function Me(e){_(t("products.title")),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("products.title")}</h1>
      <div class="flex gap-2">
        <button class="btn btn-secondary" onclick="location.hash='/categories'">🏷 ${t("categories.title")}</button>
        <button class="btn btn-primary" id="add-product-btn">+ ${t("products.add")}</button>
      </div>
    </div>

    <div class="filter-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="product-search" class="form-control" placeholder="${t("products.searchPlaceholder")}" />
      </div>
      <select class="form-control" id="category-filter" style="max-width:200px;">
        <option value="">${t("products.filterCategory")}</option>
      </select>
      <label class="form-check" style="color:var(--text-secondary); font-size:0.875rem;">
        <input type="checkbox" id="low-stock-filter" />
        ${t("products.showLowStock")}
      </label>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("products.sku")}</th>
          <th>${t("products.name")}</th>
          <th>${t("products.category")}</th>
          <th>${t("products.unit")}</th>
          <th class="text-right">${t("products.retailPrice")}</th>
          <th class="text-right">${t("products.currentStock")}</th>
          <th>${t("app.status")}</th>
          <th>${t("app.actions")}</th>
        </tr></thead>
        <tbody id="products-tbody">
          <tr><td colspan="8"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>
        </tbody>
      </table>
      <div class="pagination" id="products-pagination"></div>
    </div>
  `,await De(),await V(),Re()}async function De(){try{const{categories:e}=await nt.list();Zt=e;const s=document.getElementById("category-filter");e.forEach(n=>{const a=document.createElement("option");a.value=n.id,a.textContent=n.name,s==null||s.appendChild(a)})}catch{}}async function V(){const e=document.getElementById("products-tbody");e&&(e.innerHTML='<tr><td colspan="8"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>');try{const s={page:Q,limit:50,...dt};Object.keys(s).forEach(a=>{s[a]||delete s[a]});const n=await O.list(s);if(St=n.products,Gt=n.total,!e)return;if(!St.length){e.innerHTML=`<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-title">${t("products.noProducts")}</div></div></td></tr>`;return}e.innerHTML=St.map(a=>`
      <tr>
        <td style="font-family:monospace; font-size:0.8rem;">${a.sku||"—"}</td>
        <td>
          <div style="font-weight:500;">${a.name}</div>
          ${a.brand?`<div style="font-size:0.75rem; color:var(--text-muted);">${a.brand}${a.size?` · ${a.size}`:""}</div>`:""}
        </td>
        <td>${a.category_name||"—"}</td>
        <td>${a.unit}</td>
        <td class="text-right amount">${c(a.retail_price)}</td>
        <td class="text-right">
          <span class="${parseFloat(a.current_stock)<=parseFloat(a.low_stock_alert)?"text-warning":""}">
            ${a.current_stock}
            ${parseFloat(a.current_stock)<=parseFloat(a.low_stock_alert)?`<span class="badge badge-warning" style="margin-left:4px;">${t("products.lowStockBadge")}</span>`:""}
          </span>
        </td>
        <td><span class="badge ${a.is_active?"badge-success":"badge-muted"}">${a.is_active?t("app.active"):t("app.inactive")}</span></td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary edit-btn" data-id="${a.id}" title="${t("app.edit")}">✏</button>
            <button class="btn btn-sm btn-danger del-btn" data-id="${a.id}" title="${t("products.delete")}">🗑</button>
          </div>
        </td>
      </tr>
    `).join(""),e.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>te(a.dataset.id))),e.querySelectorAll(".del-btn").forEach(a=>a.addEventListener("click",()=>je(a.dataset.id))),F(Gt,Q,50,"products-pagination",a=>{Q=a,V()})}catch(s){f(s)}}function Re(){var s,n,a,o;let e;(s=document.getElementById("product-search"))==null||s.addEventListener("input",r=>{clearTimeout(e),e=setTimeout(()=>{dt.search=r.target.value,Q=1,V()},400)}),(n=document.getElementById("category-filter"))==null||n.addEventListener("change",r=>{dt.category_id=r.target.value,Q=1,V()}),(a=document.getElementById("low-stock-filter"))==null||a.addEventListener("change",r=>{dt.low_stock=r.target.checked?"true":"",Q=1,V()}),(o=document.getElementById("add-product-btn"))==null||o.addEventListener("click",()=>te(null))}async function te(e){let s={};if(e)try{s=(await O.get(e)).product}catch(o){f(o);return}const n=Zt.map(o=>`<option value="${o.id}" ${s.category_id===o.id?"selected":""}>${o.name}</option>`).join(""),a=document.createElement("form");a.innerHTML=`
    <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border);">
      ${t("products.basicInfo")}
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t("products.name")} <span class="required-star">*</span></label>
        <input name="name" class="form-control" value="${s.name||""}" required placeholder="${t("products.name")}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t("products.nameBn")}</label>
        <input name="name_bn" class="form-control" value="${s.name_bn||""}" placeholder="${t("products.nameBn")}" />
      </div>
    </div>
    <div class="form-row cols-3">
      <div class="form-group">
        <label class="form-label">${t("products.category")}</label>
        <select name="category_id" class="form-control"><option value="">${t("app.selectOption")}</option>${n}</select>
      </div>
      <div class="form-group">
        <label class="form-label">${t("products.sku")}</label>
        <input name="sku" class="form-control" value="${s.sku||""}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t("products.unit")} <span class="required-star">*</span></label>
        <select name="unit" class="form-control">
          ${["pcs","kg","ton","bag","m","ft","liter","bundle"].map(o=>`<option ${s.unit===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t("products.brand")}</label>
        <input name="brand" class="form-control" value="${s.brand||""}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t("products.size")}</label>
        <input name="size" class="form-control" value="${s.size||""}" />
      </div>
    </div>

    <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin:1rem 0 0.5rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border);">
      ${t("products.pricing")}
    </div>
    <div class="form-row cols-3">
      <div class="form-group">
        <label class="form-label">${t("products.retailPrice")}</label>
        <input name="retail_price" type="number" min="0" step="0.01" class="form-control" value="${s.retail_price||0}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t("products.wholesalePrice")}</label>
        <input name="wholesale_price" type="number" min="0" step="0.01" class="form-control" value="${s.wholesale_price||0}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t("products.purchaseCost")}</label>
        <input name="purchase_cost" type="number" min="0" step="0.01" class="form-control" value="${s.purchase_cost||0}" />
      </div>
    </div>

    <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin:1rem 0 0.5rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border);">
      ${t("products.inventory")}
    </div>
    <div class="form-row cols-2">
      ${e?"":`
      <div class="form-group">
        <label class="form-label">${t("products.openingStock")}</label>
        <input name="current_stock" type="number" min="0" step="0.001" class="form-control" value="0" />
      </div>`}
      <div class="form-group">
        <label class="form-label">${t("products.lowStockAlert")}</label>
        <input name="low_stock_alert" type="number" min="0" step="0.001" class="form-control" value="${s.low_stock_alert||5}" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">${t("app.notes")}</label>
      <textarea name="notes" class="form-control" rows="2">${s.notes||""}</textarea>
    </div>
    ${e?`
    <div class="form-check" style="margin-top:0.5rem;">
      <input type="checkbox" name="is_active" id="prod-active" ${s.is_active?"checked":""} />
      <label for="prod-active" class="form-label" style="margin:0;">${t("app.active")}</label>
    </div>`:""}
  `,w({title:t(e?"products.edit":"products.add"),body:a,size:"lg",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:o})=>o()},{label:t("app.save"),class:"btn-primary",action:async({close:o})=>{var i;const r=Object.fromEntries(new FormData(a));if(!r.name){y(t("products.name")+" "+t("app.required"));return}r.is_active=((i=a.querySelector("[name=is_active]"))==null?void 0:i.checked)??!0;try{e?await O.update(e,r):await O.create(r),$(t("products.saved")),o(),V()}catch(l){y(l.message)}}}]})}async function je(e){if(await R({message:t("products.deleteConfirm"),type:"warning"}))try{await O.delete(e),$(t("products.saved")),V()}catch(n){f(n)}}function F(e,s,n,a,o){var d,u;const r=document.getElementById(a);if(!r)return;const i=Math.ceil(e/n),l=(s-1)*n+1,p=Math.min(s*n,e);r.innerHTML=`
    <span class="pagination-info">
      ${t("table.showing").replace("{from}",l).replace("{to}",p).replace("{total}",e)}
    </span>
    <div class="pagination-controls">
      <button class="btn btn-sm btn-secondary" ${s<=1?"disabled":""} id="${a}-prev">
        ← ${t("table.prev")}
      </button>
      <span style="font-size:0.8rem; color:var(--text-muted);">${s} / ${i}</span>
      <button class="btn btn-sm btn-secondary" ${s>=i?"disabled":""} id="${a}-next">
        ${t("table.next")} →
      </button>
    </div>
  `,(d=document.getElementById(`${a}-prev`))==null||d.addEventListener("click",()=>o(s-1)),(u=document.getElementById(`${a}-next`))==null||u.addEventListener("click",()=>o(s+1))}let pt=1,J={start_date:"",end_date:"",sale_type:""};async function He(e){var n;_(t("sales.title"));const s=new Date().toISOString().slice(0,10);e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("sales.title")}</h1>
      <button class="btn btn-primary" onclick="location.hash='/pos'">🛒 ${t("quick.newSale")}</button>
    </div>
    <div class="filter-bar">
      <input type="date" id="sale-from" class="form-control" style="max-width:160px;" value="${s}" />
      <input type="date" id="sale-to" class="form-control" style="max-width:160px;" value="${s}" />
      <select id="sale-type-filter" class="form-control" style="max-width:140px;">
        <option value="">${t("app.all")}</option>
        <option value="cash">${t("sales.types.cash")}</option>
        <option value="credit">${t("sales.types.credit")}</option>
        <option value="wholesale">${t("sales.types.wholesale")}</option>
      </select>
      <button class="btn btn-secondary" id="sales-filter-btn">🔍 ${t("app.filter")}</button>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("sales.invoice")}</th>
          <th>${t("sales.date")}</th>
          <th>${t("sales.customer")}</th>
          <th>${t("sales.type")}</th>
          <th class="text-right">${t("sales.total")}</th>
          <th class="text-right">${t("sales.paid")}</th>
          <th class="text-right">${t("sales.due")}</th>
          <th>${t("sales.status")}</th>
          <th>${t("app.actions")}</th>
        </tr></thead>
        <tbody id="sales-tbody"><tr><td colspan="9"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
      <div class="pagination" id="sales-pagination"></div>
    </div>
  `,J.start_date=s,J.end_date=s,await gt(),(n=document.getElementById("sales-filter-btn"))==null||n.addEventListener("click",()=>{var a,o,r;J.start_date=(a=document.getElementById("sale-from"))==null?void 0:a.value,J.end_date=(o=document.getElementById("sale-to"))==null?void 0:o.value,J.sale_type=(r=document.getElementById("sale-type-filter"))==null?void 0:r.value,pt=1,gt()})}async function gt(){const e=document.getElementById("sales-tbody");e&&(e.innerHTML='<tr><td colspan="9"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>');try{const s={page:pt,limit:50,...J};Object.keys(s).forEach(o=>{s[o]||delete s[o]});const n=await wt.list(s),a=n.sales;if(!a.length){e&&(e.innerHTML=`<tr><td colspan="9"><div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">${t("sales.noSales")}</div></div></td></tr>`);return}e&&(e.innerHTML=a.map(o=>`
      <tr>
        <td style="font-family:monospace; font-size:0.8rem; font-weight:600;">${o.invoice_no}</td>
        <td>${L(o.sale_date)}</td>
        <td>${o.customer_name||"—"}</td>
        <td><span class="badge ${o.sale_type==="cash"?"badge-success":o.sale_type==="credit"?"badge-warning":"badge-info"}">${t(`sales.types.${o.sale_type}`)}</span></td>
        <td class="text-right amount">${c(o.total)}</td>
        <td class="text-right amount positive">${c(o.paid)}</td>
        <td class="text-right amount ${parseFloat(o.due)>0?"negative":""}">${c(o.due)}</td>
        <td><span class="badge ${o.status==="completed"?"badge-success":"badge-danger"}">${t(`sales.${o.status}`)}</span></td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary view-btn" data-id="${o.id}">👁</button>
            ${o.status==="completed"?`<button class="btn btn-sm btn-danger void-btn" data-id="${o.id}">✕ ${t("sales.void")}</button>`:""}
          </div>
        </td>
      </tr>
    `).join("")),e==null||e.querySelectorAll(".view-btn").forEach(o=>o.addEventListener("click",()=>ze(o.dataset.id))),e==null||e.querySelectorAll(".void-btn").forEach(o=>o.addEventListener("click",()=>Oe(o.dataset.id))),F(n.total,pt,50,"sales-pagination",o=>{pt=o,gt()})}catch(s){f(s)}}async function ze(e){const s=document.createElement("div");s.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>',w({title:t("sales.viewInvoice"),body:s,size:"lg",footer:[{label:t("app.close"),class:"btn-secondary",action:({close:n})=>n()}]});try{const{sale:n,items:a}=await wt.get(e);s.innerHTML=`
      <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
        <div>
          <div style="font-size:1.2rem; font-weight:700; font-family:monospace;">${n.invoice_no}</div>
          <div style="color:var(--text-muted); font-size:0.8rem;">${L(n.sale_date)}</div>
        </div>
        <span class="badge ${n.status==="completed"?"badge-success":"badge-danger"}">${t(`sales.${n.status}`)}</span>
      </div>
      ${n.customer_name?`<div style="margin-bottom:1rem; padding:0.75rem; background:var(--bg-base); border-radius:0.5rem;">
        <div style="font-size:0.75rem; color:var(--text-muted);">${t("sales.customer")}</div>
        <div style="font-weight:600;">${n.customer_name}</div>
        ${n.customer_phone?`<div style="font-size:0.8rem; color:var(--text-secondary);">${n.customer_phone}</div>`:""}
      </div>`:""}
      <table class="table" style="margin-bottom:1rem;">
        <thead><tr><th>${t("pos.product")}</th><th class="text-right">${t("pos.qty")}</th><th class="text-right">${t("pos.unitPrice")}</th><th class="text-right">${t("pos.itemTotal")}</th></tr></thead>
        <tbody>
          ${a.map(o=>`<tr><td>${o.product_name}</td><td class="text-right">${o.qty} ${o.unit}</td><td class="text-right amount">${c(o.unit_price)}</td><td class="text-right amount">${c(o.total)}</td></tr>`).join("")}
        </tbody>
        <tfoot>
          <tr><td colspan="3" class="text-right" style="font-weight:600;">${t("app.subtotal")}</td><td class="text-right amount">${c(n.subtotal)}</td></tr>
          ${parseFloat(n.discount)>0?`<tr><td colspan="3" class="text-right" style="color:var(--text-muted);">${t("app.discount")}</td><td class="text-right amount" style="color:var(--color-danger);">−${c(n.discount)}</td></tr>`:""}
          <tr><td colspan="3" class="text-right" style="font-weight:700; font-size:1rem;">${t("app.total")}</td><td class="text-right amount" style="font-size:1rem; font-weight:700;">${c(n.total)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:var(--color-success);">${t("app.paid")}</td><td class="text-right amount" style="color:var(--color-success);">${c(n.paid)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:var(--color-warning);">${t("app.due")}</td><td class="text-right amount" style="color:var(--color-warning);">${c(n.due)}</td></tr>
        </tfoot>
      </table>
      ${n.void_reason?`<div style="background:var(--color-danger-light); border:1px solid var(--color-danger); border-radius:0.5rem; padding:0.75rem; color:#991b1b; font-size:0.875rem;"><strong>${t("sales.voidReason")}:</strong> ${n.void_reason}</div>`:""}
    `}catch(n){s.innerHTML=`<p>${n.message}</p>`}}async function Oe(e){if(!await R({message:t("sales.voidConfirm"),type:"danger",confirmLabel:t("sales.void")}))return;const n=document.createElement("form");n.innerHTML=`
    <div class="form-group">
      <label class="form-label">${t("sales.voidReason")} *</label>
      <textarea name="void_reason" class="form-control" rows="3" placeholder="${t("sales.voidReason")}" required></textarea>
    </div>
  `,w({title:t("sales.void"),body:n,size:"sm",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:a})=>a()},{label:t("sales.void"),class:"btn-danger",action:async({close:a})=>{const o=n.querySelector("[name=void_reason]").value;if(!o){y(t("sales.voidReason")+" required");return}try{await wt.void(e,o),$("Sale voided"),a(),gt()}catch(r){y(r.message)}}}]})}let ut=1,et={start_date:"",end_date:""},P=[];async function Fe(e){var n,a;_(t("purchases.title"));const s=new Date().toISOString().slice(0,10);e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("purchases.title")}</h1>
      <button class="btn btn-primary" id="new-purchase-btn">+ ${t("purchases.add")}</button>
    </div>
    <div class="filter-bar">
      <input type="date" id="pur-from" class="form-control" style="max-width:160px;" value="${s}" />
      <input type="date" id="pur-to" class="form-control" style="max-width:160px;" value="${s}" />
      <button class="btn btn-secondary" id="pur-filter-btn">🔍 ${t("app.filter")}</button>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("purchases.invoice")}</th>
          <th>${t("purchases.date")}</th>
          <th>${t("purchases.supplier")}</th>
          <th class="text-right">${t("purchases.total")}</th>
          <th class="text-right">${t("purchases.paid")}</th>
          <th class="text-right">${t("purchases.due")}</th>
          <th>${t("app.actions")}</th>
        </tr></thead>
        <tbody id="purchases-tbody"><tr><td colspan="7"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
      <div class="pagination" id="purchases-pagination"></div>
    </div>
  `,et.start_date=s,et.end_date=s,await ht(),(n=document.getElementById("pur-filter-btn"))==null||n.addEventListener("click",()=>{var o,r;et.start_date=(o=document.getElementById("pur-from"))==null?void 0:o.value,et.end_date=(r=document.getElementById("pur-to"))==null?void 0:r.value,ut=1,ht()}),(a=document.getElementById("new-purchase-btn"))==null||a.addEventListener("click",()=>Ue())}async function ht(){const e=document.getElementById("purchases-tbody");e&&(e.innerHTML='<tr><td colspan="7"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>');try{const s={page:ut,limit:50,...et};Object.keys(s).forEach(o=>{s[o]||delete s[o]});const n=await Ct.list(s),a=n.purchases;if(!a.length){e&&(e.innerHTML=`<tr><td colspan="7"><div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-title">${t("purchases.noPurchases")}</div></div></td></tr>`);return}e&&(e.innerHTML=a.map(o=>`
      <tr>
        <td style="font-family:monospace; font-size:0.8rem; font-weight:600;">${o.invoice_no}</td>
        <td>${L(o.purchase_date)}</td>
        <td>${o.supplier_name||"—"}</td>
        <td class="text-right amount">${c(o.total)}</td>
        <td class="text-right amount positive">${c(o.paid)}</td>
        <td class="text-right amount ${parseFloat(o.due)>0?"negative":""}">${c(o.due)}</td>
        <td><button class="btn btn-sm btn-secondary view-btn" data-id="${o.id}">👁</button></td>
      </tr>
    `).join("")),e==null||e.querySelectorAll(".view-btn").forEach(o=>o.addEventListener("click",()=>Ne(o.dataset.id))),F(n.total,ut,50,"purchases-pagination",o=>{ut=o,ht()})}catch(s){f(s)}}async function Ne(e){const s=document.createElement("div");s.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>',w({title:t("purchases.title"),body:s,size:"lg",footer:[{label:t("app.close"),class:"btn-secondary",action:({close:n})=>n()}]});try{const{purchase:n,items:a}=await Ct.get(e);s.innerHTML=`
      <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
        <div><div style="font-size:1.2rem; font-weight:700; font-family:monospace;">${n.invoice_no}</div><div style="color:var(--text-muted);">${L(n.purchase_date)}</div></div>
      </div>
      ${n.supplier_name?`<div style="margin-bottom:1rem; padding:0.75rem; background:var(--bg-base); border-radius:0.5rem;"><div style="font-size:0.75rem; color:var(--text-muted);">${t("purchases.supplier")}</div><div style="font-weight:600;">${n.supplier_name}</div></div>`:""}
      <table class="table"><thead><tr><th>${t("pos.product")}</th><th class="text-right">${t("pos.qty")}</th><th class="text-right">${t("inventory.movementTypes.purchase")}</th><th class="text-right">${t("pos.itemTotal")}</th></tr></thead>
        <tbody>${a.map(o=>`<tr><td>${o.product_name}</td><td class="text-right">${o.qty}</td><td class="text-right amount">${c(o.unit_cost)}</td><td class="text-right amount">${c(o.total)}</td></tr>`).join("")}</tbody>
        <tfoot>
          <tr><td colspan="3" class="text-right" style="font-weight:700;">${t("app.total")}</td><td class="text-right amount" style="font-weight:700;">${c(n.total)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:var(--color-success);">${t("app.paid")}</td><td class="text-right amount" style="color:var(--color-success);">${c(n.paid)}</td></tr>
          <tr><td colspan="3" class="text-right" style="color:var(--color-warning);">${t("app.due")}</td><td class="text-right amount" style="color:var(--color-warning);">${c(n.due)}</td></tr>
        </tfoot>
      </table>
    `}catch(n){s.innerHTML=`<p>${n.message}</p>`}}async function Ue(){P=[];let e=[],s=[];try{const[r,i]=await Promise.all([D.list({limit:500}),T.list()]);e=r.suppliers,s=i.accounts.filter(l=>l.type!=="capital")}catch{}const n=new Date().toISOString().slice(0,10),a=document.createElement("div"),o=()=>{const r=P.reduce((m,b)=>m+(b.qty*b.unit_cost-b.discount),0);a.innerHTML=`
      <div class="form-row cols-2" style="margin-bottom:1rem;">
        <div class="form-group">
          <label class="form-label">${t("purchases.supplier")}</label>
          <select id="pur-supplier" class="form-control">
            <option value="">${t("app.selectOption")}</option>
            ${e.map(m=>`<option value="${m.id}">${m.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">${t("purchases.date")}</label>
          <input id="pur-date" type="date" class="form-control" value="${n}" />
        </div>
      </div>

      <!-- Product search for purchase -->
      <div class="form-group">
        <label class="form-label">${t("pos.searchProduct")}</label>
        <div style="display:flex; gap:0.5rem;">
          <input type="text" id="pur-prod-search" class="form-control" placeholder="${t("pos.searchProduct")}" />
          <button type="button" class="btn btn-secondary" id="pur-search-btn">🔍</button>
        </div>
        <div id="pur-search-results" style="margin-top:0.5rem;"></div>
      </div>

      <!-- Items table -->
      ${P.length>0?`
      <table class="table" style="margin-bottom:1rem;">
        <thead><tr><th>${t("pos.product")}</th><th class="text-right">${t("pos.qty")}</th><th class="text-right">Cost</th><th class="text-right">${t("app.discount")}</th><th class="text-right">${t("pos.itemTotal")}</th><th></th></tr></thead>
        <tbody>
          ${P.map((m,b)=>`
            <tr class="item-row" data-idx="${b}">
              <td>${m.name}</td>
              <td class="text-right"><input type="number" class="form-control item-qty" data-idx="${b}" value="${m.qty}" min="0.001" step="0.001" style="width:80px; text-align:right;" /></td>
              <td class="text-right"><input type="number" class="form-control item-cost" data-idx="${b}" value="${m.unit_cost}" min="0" step="0.01" style="width:100px; text-align:right;" /></td>
              <td class="text-right"><input type="number" class="form-control item-disc" data-idx="${b}" value="${m.discount}" min="0" step="0.01" style="width:80px; text-align:right;" /></td>
              <td class="text-right amount item-total-cell">${c(m.qty*m.unit_cost-m.discount)}</td>
              <td><button type="button" class="btn btn-ghost btn-sm item-remove" data-idx="${b}">✕</button></td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot><tr><td colspan="4" class="text-right font-semibold">${t("app.subtotal")}</td><td class="text-right amount pur-subtotal-cell">${c(r)}</td><td></td></tr></tfoot>
      </table>`:`<div class="empty-state" style="padding:1.5rem;"><div class="empty-state-icon">📦</div><div class="empty-state-text">${t("pos.emptyCart")}</div></div>`}

      <div class="form-row cols-3">
        <div class="form-group">
          <label class="form-label">${t("app.discount")}</label>
          <input id="pur-discount" type="number" min="0" step="0.01" class="form-control" value="0" />
        </div>
        <div class="form-group">
          <label class="form-label">${t("app.paid")}</label>
          <input id="pur-paid" type="number" min="0" step="0.01" class="form-control" value="0" />
        </div>
        <div class="form-group">
          <label class="form-label">${t("payments.account")}</label>
          <select id="pur-account" class="form-control">
            <option value="">${t("app.selectOption")}</option>
            ${s.map(m=>`<option value="${m.id}" ${m.is_default?"selected":""}>${m.name}</option>`).join("")}
          </select>
        </div>
      </div>
    `;const i=()=>{const m=P.reduce((h,g)=>h+Math.max(0,g.qty*g.unit_cost-g.discount),0);a.querySelectorAll(".item-row").forEach((h,g)=>{const C=P[g];if(!C)return;const A=h.querySelector(".item-total-cell");A&&(A.textContent=c(Math.max(0,C.qty*C.unit_cost-C.discount)))});const b=a.querySelector(".pur-subtotal-cell");b&&(b.textContent=c(m))};a.querySelectorAll(".item-qty").forEach(m=>{m.addEventListener("input",b=>{P[parseInt(b.target.dataset.idx)].qty=parseFloat(b.target.value)||0,i()})}),a.querySelectorAll(".item-cost").forEach(m=>{m.addEventListener("input",b=>{P[parseInt(b.target.dataset.idx)].unit_cost=parseFloat(b.target.value)||0,i()})}),a.querySelectorAll(".item-disc").forEach(m=>{m.addEventListener("input",b=>{P[parseInt(b.target.dataset.idx)].discount=parseFloat(b.target.value)||0,i()})}),a.querySelectorAll(".item-remove").forEach(m=>{m.addEventListener("click",b=>{P.splice(parseInt(b.currentTarget.dataset.idx),1),o()})});const l=a.querySelector("#pur-search-btn"),p=a.querySelector("#pur-prod-search"),d=a.querySelector("#pur-search-results"),u=async()=>{const m=p==null?void 0:p.value;if(m)try{const{products:b}=await O.search(m);if(!d)return;d.innerHTML=b.map(h=>`
          <button type="button" class="btn btn-secondary btn-sm pur-add-product" data-product='${JSON.stringify({id:h.id,name:h.name,unit:h.unit,unit_cost:h.purchase_cost})}' style="margin:2px;">
            ${h.name} (${h.unit}) — ${c(h.purchase_cost)}
          </button>
        `).join(""),d.querySelectorAll(".pur-add-product").forEach(h=>{h.addEventListener("click",()=>{const g=JSON.parse(h.dataset.product);P.push({product_id:g.id,name:g.name,unit:g.unit,qty:1,unit_cost:g.unit_cost,discount:0}),p&&(p.value=""),d&&(d.innerHTML=""),o()})})}catch{}};l==null||l.addEventListener("click",u),p==null||p.addEventListener("keydown",m=>{m.key==="Enter"&&(m.preventDefault(),u())})};o(),w({title:t("purchases.add"),body:a,size:"xl",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:r})=>r()},{label:t("app.save"),class:"btn-primary",action:async({close:r})=>{var l,p,d,u,m;if(!P.length){y(t("pos.itemsRequired"));return}const i={supplier_id:((l=a.querySelector("#pur-supplier"))==null?void 0:l.value)||void 0,purchase_date:(p=a.querySelector("#pur-date"))==null?void 0:p.value,items:P.map(b=>({product_id:b.product_id,qty:b.qty,unit_cost:b.unit_cost,discount:b.discount})),discount:parseFloat((d=a.querySelector("#pur-discount"))==null?void 0:d.value)||0,paid:parseFloat((u=a.querySelector("#pur-paid"))==null?void 0:u.value)||0,account_id:((m=a.querySelector("#pur-account"))==null?void 0:m.value)||void 0};try{const{purchase:b}=await Ct.create(i);$(`${t("purchases.saved")} · ${b.invoice_no}`),r(),ht()}catch(b){y(b.message)}}}]})}let mt=1,ee="";async function Ve(e){_(t("customers.title")),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("customers.title")}</h1>
      <button class="btn btn-primary" id="add-customer-btn">+ ${t("customers.add")}</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="customer-search" class="form-control" placeholder="${t("customers.searchPlaceholder")}" />
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("customers.name")}</th>
          <th>${t("customers.phone")}</th>
          <th class="text-right">${t("customers.currentDue")}</th>
          <th>${t("customers.lastTransaction")}</th>
          <th>${t("app.actions")}</th>
        </tr></thead>
        <tbody id="customers-tbody">
          <tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>
        </tbody>
      </table>
      <div class="pagination" id="customers-pagination"></div>
    </div>
  `,await Z(),Ge()}async function Z(){const e=document.getElementById("customers-tbody");e&&(e.innerHTML='<tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>');try{const s=await M.list({page:mt,limit:50,search:ee}),n=s.customers;if(!e)return;if(!n.length){e.innerHTML=`<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-title">${t("customers.noCustomers")}</div></div></td></tr>`;return}e.innerHTML=n.map(a=>`
      <tr>
        <td>
          <div style="font-weight:500;">${a.name}</div>
          ${a.address?`<div style="font-size:0.75rem; color:var(--text-muted);">${a.address}</div>`:""}
        </td>
        <td>${a.phone||"—"}</td>
        <td class="text-right">
          <span class="${parseFloat(a.balance)>0?"text-warning font-semibold":"text-muted"}">${c(a.balance)}</span>
        </td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${a.last_transaction?L(a.last_transaction):"—"}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary ledger-btn" data-id="${a.id}" data-name="${a.name}" title="${t("customers.ledger")}">📋</button>
            <button class="btn btn-sm btn-success pay-btn" data-id="${a.id}" data-name="${a.name}" data-balance="${a.balance}" title="${t("customers.receivePayment")}">💰</button>
            <button class="btn btn-sm btn-secondary edit-btn" data-id="${a.id}" title="${t("app.edit")}">✏</button>
            <button class="btn btn-sm btn-danger del-btn" data-id="${a.id}" title="${t("app.delete")}">🗑</button>
          </div>
        </td>
      </tr>
    `).join(""),e.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>ae(a.dataset.id))),e.querySelectorAll(".del-btn").forEach(a=>a.addEventListener("click",()=>We(a.dataset.id))),e.querySelectorAll(".ledger-btn").forEach(a=>a.addEventListener("click",()=>Je(a.dataset.id,a.dataset.name))),e.querySelectorAll(".pay-btn").forEach(a=>a.addEventListener("click",()=>Ke(a.dataset.id,a.dataset.name,a.dataset.balance))),F(s.total,mt,50,"customers-pagination",a=>{mt=a,Z()})}catch(s){f(s)}}function Ge(){var s,n;(s=document.getElementById("add-customer-btn"))==null||s.addEventListener("click",()=>ae(null));let e;(n=document.getElementById("customer-search"))==null||n.addEventListener("input",a=>{clearTimeout(e),e=setTimeout(()=>{ee=a.target.value,mt=1,Z()},400)})}async function ae(e){let s={};if(e)try{s=(await M.get(e)).customer}catch(a){f(a);return}const n=document.createElement("form");n.innerHTML=`
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t("customers.name")} <span class="required-star">*</span></label>
        <input name="name" class="form-control" value="${s.name||""}" required />
      </div>
      <div class="form-group">
        <label class="form-label">${t("customers.phone")}</label>
        <input name="phone" class="form-control" value="${s.phone||""}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">${t("customers.address")}</label>
      <textarea name="address" class="form-control" rows="2">${s.address||""}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">${t("customers.creditLimit")}</label>
      <input name="credit_limit" type="number" min="0" step="0.01" class="form-control" value="${s.credit_limit||0}" />
    </div>
    ${e?`<div class="form-check"><input type="checkbox" name="is_active" ${s.is_active?"checked":""} /><label class="form-label" style="margin:0;">${t("app.active")}</label></div>`:""}
  `,w({title:t(e?"customers.edit":"customers.add"),body:n,size:"md",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:a})=>a()},{label:t("app.save"),class:"btn-primary",action:async({close:a})=>{var r;const o=Object.fromEntries(new FormData(n));if(!o.name){y(t("customers.name")+" required");return}e&&(o.is_active=((r=n.querySelector("[name=is_active]"))==null?void 0:r.checked)??!0);try{e?await M.update(e,o):await M.create(o),$(t("customers.saved")),a(),Z()}catch(i){y(i.message)}}}]})}async function We(e){if(await R({message:t("customers.deleteConfirm"),type:"danger"}))try{await M.delete(e),$(t("customers.saved")),Z()}catch(n){f(n)}}async function Je(e,s){const n=document.createElement("div");n.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>',w({title:`${t("ledger.title")} — ${s}`,body:n,size:"xl",footer:[{label:t("app.close"),class:"btn-secondary",action:({close:a})=>a()}]});try{const{ledger:a}=await M.ledger(e);if(!a.length){n.innerHTML=`<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">${t("ledger.noEntries")}</div></div>`;return}n.innerHTML=`
      <div class="table-wrapper">
        <table class="table">
          <thead><tr>
            <th>${t("ledger.date")}</th>
            <th>${t("ledger.description")}</th>
            <th class="text-right">${t("ledger.debit")}</th>
            <th class="text-right">${t("ledger.credit")}</th>
            <th class="text-right">${t("ledger.balance")}</th>
          </tr></thead>
          <tbody>
            ${a.map(o=>`
              <tr>
                <td>${L(o.txn_date)}</td>
                <td>
                  <div style="font-weight:500;">${o.type}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${o.reference}</div>
                </td>
                <td class="text-right amount ${parseFloat(o.debit)>0?"positive":""}">${parseFloat(o.debit)>0?c(o.debit):"—"}</td>
                <td class="text-right amount ${parseFloat(o.credit)>0?"positive":""}">${parseFloat(o.credit)>0?c(o.credit):"—"}</td>
                <td class="text-right amount ${o.balance>0?"":"positive"}">${c(o.balance)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `}catch(a){n.innerHTML=`<div class="empty-state"><div class="empty-state-title">${a.message}</div></div>`}}async function Ke(e,s,n){let a=[];try{a=(await T.list()).accounts.filter(l=>l.type!=="capital")}catch{}const o=document.createElement("form"),r=new Date().toISOString().slice(0,10);o.innerHTML=`
    <div style="background:var(--color-warning-light); border:1px solid var(--color-warning); border-radius:0.5rem; padding:0.75rem; margin-bottom:1rem; color:#92400e;">
      ${t("customers.currentDue")}: <strong>${c(n)}</strong>
    </div>
    <div class="form-group">
      <label class="form-label">${t("payments.amount")} <span class="required-star">*</span></label>
      <input name="amount" type="number" min="0.01" step="0.01" class="form-control" value="${n>0?parseFloat(n).toFixed(2):""}" required />
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t("payments.account")} <span class="required-star">*</span></label>
        <select name="account_id" class="form-control" required>
          <option value="">${t("app.selectOption")}</option>
          ${a.map(i=>`<option value="${i.id}" ${i.is_default?"selected":""}>${i.name}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${t("payments.method")}</label>
        <select name="method" class="form-control">
          ${["cash","bank_transfer","cheque","mobile_banking"].map(i=>`<option value="${i}">${t(`payments.methods.${i}`)}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t("payments.paymentDate")}</label>
        <input name="payment_date" type="date" class="form-control" value="${r}" />
      </div>
      <div class="form-group">
        <label class="form-label">${t("payments.reference")}</label>
        <input name="reference" class="form-control" placeholder="${t("app.optional")}" />
      </div>
    </div>
  `,w({title:`${t("customers.receivePayment")} — ${s}`,body:o,size:"md",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:i})=>i()},{label:t("payments.receivePayment"),class:"btn-success",action:async({close:i})=>{const l=Object.fromEntries(new FormData(o));if(l.customer_id=e,!l.amount||!l.account_id){y(t("payments.amount")+" and "+t("payments.account")+" required");return}try{await Y.customerCreate(l),$(t("payments.recorded")),i(),Z()}catch(p){y(p.message)}}}]})}let vt=1,se="";async function Qe(e){var n,a;_(t("suppliers.title")),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("suppliers.title")}</h1>
      <button class="btn btn-primary" id="add-supplier-btn">+ ${t("suppliers.add")}</button>
    </div>
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="supplier-search" class="form-control" placeholder="${t("app.search")}" />
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("suppliers.name")}</th>
          <th>${t("suppliers.phone")}</th>
          <th class="text-right">${t("suppliers.currentDue")}</th>
          <th>${t("suppliers.lastTransaction")}</th>
          <th>${t("app.actions")}</th>
        </tr></thead>
        <tbody id="suppliers-tbody"><tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
      <div class="pagination" id="suppliers-pagination"></div>
    </div>
  `,await X(),(n=document.getElementById("add-supplier-btn"))==null||n.addEventListener("click",()=>ne(null));let s;(a=document.getElementById("supplier-search"))==null||a.addEventListener("input",o=>{clearTimeout(s),s=setTimeout(()=>{se=o.target.value,vt=1,X()},400)})}async function X(){const e=document.getElementById("suppliers-tbody");e&&(e.innerHTML='<tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>');try{const s=await D.list({page:vt,limit:50,search:se}),n=s.suppliers;if(!n.length){e&&(e.innerHTML=`<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">🏭</div><div class="empty-state-title">${t("suppliers.noSuppliers")}</div></div></td></tr>`);return}e&&(e.innerHTML=n.map(a=>`
      <tr>
        <td><div style="font-weight:500;">${a.name}</div></td>
        <td>${a.phone||"—"}</td>
        <td class="text-right"><span class="${parseFloat(a.balance)>0?"text-warning font-semibold":"text-muted"}">${c(a.balance)}</span></td>
        <td style="font-size:0.8rem; color:var(--text-muted);">—</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary ledger-btn" data-id="${a.id}" data-name="${a.name}">📋</button>
            <button class="btn btn-sm btn-success pay-btn" data-id="${a.id}" data-name="${a.name}" data-balance="${a.balance}">💸</button>
            <button class="btn btn-sm btn-secondary edit-btn" data-id="${a.id}">✏</button>
            <button class="btn btn-sm btn-danger del-btn" data-id="${a.id}">🗑</button>
          </div>
        </td>
      </tr>
    `).join("")),e==null||e.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>ne(a.dataset.id))),e==null||e.querySelectorAll(".del-btn").forEach(a=>a.addEventListener("click",()=>Ye(a.dataset.id))),e==null||e.querySelectorAll(".ledger-btn").forEach(a=>a.addEventListener("click",()=>Xe(a.dataset.id,a.dataset.name))),e==null||e.querySelectorAll(".pay-btn").forEach(a=>a.addEventListener("click",()=>Ze(a.dataset.id,a.dataset.name,a.dataset.balance))),F(s.total,vt,50,"suppliers-pagination",a=>{vt=a,X()})}catch(s){f(s)}}async function ne(e){let s={};if(e)try{s=(await D.get(e)).supplier}catch(a){f(a);return}const n=document.createElement("form");n.innerHTML=`
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">${t("suppliers.name")} *</label><input name="name" class="form-control" value="${s.name||""}" required /></div>
      <div class="form-group"><label class="form-label">${t("suppliers.phone")}</label><input name="phone" class="form-control" value="${s.phone||""}" /></div>
    </div>
    <div class="form-group"><label class="form-label">${t("suppliers.address")}</label><textarea name="address" class="form-control" rows="2">${s.address||""}</textarea></div>
    <div class="form-group"><label class="form-label">${t("app.notes")}</label><textarea name="notes" class="form-control" rows="2">${s.notes||""}</textarea></div>
    ${e?`<div class="form-check"><input type="checkbox" name="is_active" ${s.is_active?"checked":""} /><label class="form-label" style="margin:0;">${t("app.active")}</label></div>`:""}
  `,w({title:t(e?"suppliers.edit":"suppliers.add"),body:n,size:"md",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:a})=>a()},{label:t("app.save"),class:"btn-primary",action:async({close:a})=>{var r;const o=Object.fromEntries(new FormData(n));e&&(o.is_active=((r=n.querySelector("[name=is_active]"))==null?void 0:r.checked)??!0);try{e?await D.update(e,o):await D.create(o),$(t("suppliers.saved")),a(),X()}catch(i){y(i.message)}}}]})}async function Ye(e){if(await R({message:t("suppliers.deleteConfirm"),type:"danger"}))try{await D.delete(e),X()}catch(n){f(n)}}async function Xe(e,s){const n=document.createElement("div");n.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>',w({title:`${t("ledger.title")} — ${s}`,body:n,size:"xl",footer:[{label:t("app.close"),class:"btn-secondary",action:({close:a})=>a()}]});try{const{ledger:a}=await D.ledger(e);if(!a.length){n.innerHTML=`<div class="empty-state"><div class="empty-state-title">${t("ledger.noEntries")}</div></div>`;return}n.innerHTML=`<div class="table-wrapper"><table class="table"><thead><tr><th>${t("ledger.date")}</th><th>${t("ledger.description")}</th><th class="text-right">${t("ledger.debit")}</th><th class="text-right">${t("ledger.credit")}</th><th class="text-right">${t("ledger.balance")}</th></tr></thead><tbody>
      ${a.map(o=>`<tr><td>${L(o.txn_date)}</td><td><div style="font-weight:500;">${o.type}</div><div style="font-size:0.75rem; color:var(--text-muted);">${o.reference}</div></td><td class="text-right amount">${parseFloat(o.debit)>0?c(o.debit):"—"}</td><td class="text-right amount">${parseFloat(o.credit)>0?c(o.credit):"—"}</td><td class="text-right amount">${c(o.balance)}</td></tr>`).join("")}
    </tbody></table></div>`}catch(a){n.innerHTML=`<div class="empty-state"><div class="empty-state-title">${a.message}</div></div>`}}async function Ze(e,s,n){let a=[];try{a=(await T.list()).accounts.filter(l=>l.type!=="capital")}catch{}const o=new Date().toISOString().slice(0,10),r=document.createElement("form");r.innerHTML=`
    <div style="background:var(--color-warning-light); border:1px solid var(--color-warning); border-radius:0.5rem; padding:0.75rem; margin-bottom:1rem; color:#92400e;">
      ${t("suppliers.currentDue")}: <strong>${c(n)}</strong>
    </div>
    <div class="form-group"><label class="form-label">${t("payments.amount")} *</label><input name="amount" type="number" min="0.01" step="0.01" class="form-control" value="${parseFloat(n)>0?parseFloat(n).toFixed(2):""}" required /></div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">${t("payments.account")} *</label>
        <select name="account_id" class="form-control" required><option value="">${t("app.selectOption")}</option>${a.map(i=>`<option value="${i.id}" ${i.is_default?"selected":""}>${i.name}</option>`).join("")}</select>
      </div>
      <div class="form-group"><label class="form-label">${t("payments.method")}</label>
        <select name="method" class="form-control">${["cash","bank_transfer","cheque","mobile_banking"].map(i=>`<option value="${i}">${t(`payments.methods.${i}`)}</option>`).join("")}</select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">${t("payments.paymentDate")}</label><input name="payment_date" type="date" class="form-control" value="${o}" /></div>
      <div class="form-group"><label class="form-label">${t("payments.reference")}</label><input name="reference" class="form-control" /></div>
    </div>
  `,w({title:`${t("suppliers.makePayment")} — ${s}`,body:r,size:"md",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:i})=>i()},{label:t("payments.makePayment"),class:"btn-success",action:async({close:i})=>{const l=Object.fromEntries(new FormData(r));l.supplier_id=e;try{await Y.supplierCreate(l),$(t("payments.recorded")),i(),X()}catch(p){y(p.message)}}}]})}let it=[];async function ta(e){_(t("categories.title")),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("categories.title")}</h1>
      <div class="flex gap-2">
        <button class="btn btn-primary" id="add-category-btn">+ ${t("categories.add")}</button>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th style="width:70px;">${t("categories.sortOrder")}</th>
            <th>${t("categories.name")}</th>
            <th>${t("categories.nameBn")}</th>
            <th>${t("categories.slug")}</th>
            <th>${t("app.status")}</th>
            <th>${t("app.actions")}</th>
          </tr>
        </thead>
        <tbody id="categories-tbody">
          <tr><td colspan="6"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>
        </tbody>
      </table>
    </div>
  `,await Mt(),ea()}async function Mt(){const e=document.getElementById("categories-tbody");e&&(e.innerHTML='<tr><td colspan="6"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>');try{if(it=(await nt.list()).categories||[],!e)return;if(!it.length){e.innerHTML=`
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <div class="empty-state-icon">🏷</div>
              <div class="empty-state-title">${t("app.noData")}</div>
            </div>
          </td>
        </tr>
      `;return}e.innerHTML=it.map(n=>`
      <tr>
        <td style="font-weight:600; color:var(--text-muted);">${n.sort_order??0}</td>
        <td style="font-weight:600;">${n.name}</td>
        <td>${n.name_bn||"—"}</td>
        <td style="font-family:monospace; font-size:0.85rem; color:var(--text-secondary);">${n.slug}</td>
        <td>
          <span class="badge ${n.is_active?"badge-success":"badge-muted"}">
            ${n.is_active?t("app.active"):t("app.inactive")}
          </span>
        </td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary edit-cat-btn" data-id="${n.id}" title="${t("app.edit")}">✏</button>
            <button class="btn btn-sm btn-danger del-cat-btn" data-id="${n.id}" title="${t("app.delete")}">🗑</button>
          </div>
        </td>
      </tr>
    `).join(""),e.querySelectorAll(".edit-cat-btn").forEach(n=>{n.addEventListener("click",()=>{const a=it.find(o=>o.id===parseInt(n.dataset.id));a&&oe(a)})}),e.querySelectorAll(".del-cat-btn").forEach(n=>{n.addEventListener("click",()=>aa(parseInt(n.dataset.id)))})}catch(s){f(s)}}function ea(){var e;(e=document.getElementById("add-category-btn"))==null||e.addEventListener("click",()=>oe(null))}function oe(e){const s=!!e,n=t(s?"categories.edit":"categories.add");`${t("categories.name")}${(e==null?void 0:e.name)||""}${t("categories.nameBn")}${(e==null?void 0:e.name_bn)||""}${t("categories.slug")}${(e==null?void 0:e.slug)||""}${t("categories.sortOrder")}${(e==null?void 0:e.sort_order)??0}`,!s||e!=null&&e.is_active,`${t("app.active")}`,w({title:n,buttons:[{label:t("app.cancel"),class:"btn-secondary",action:({close:a})=>a()},{label:t("app.save"),class:"btn-primary",action:async({close:a})=>{const o=document.getElementById("category-modal-form");if(!o)return;const r=new FormData(o),i={name:r.get("name").trim(),name_bn:r.get("name_bn").trim()||null,slug:r.get("slug").trim().toLowerCase().replace(/\s+/g,"-"),sort_order:parseInt(r.get("sort_order"))||0,is_active:r.get("is_active")==="on"};if(!i.name||!i.slug){y(t("categories.name")+" and "+t("categories.slug")+" are required");return}try{s?await nt.update(e.id,i):await nt.create(i),$(t("categories.saved")),a(),Mt()}catch(l){y(l.message||"Failed to save category")}}}]})}async function aa(e){if(await R({title:t("app.delete"),message:t("confirm.deleteItem"),type:"danger",confirmLabel:t("app.delete")}))try{await nt.delete(e),$(t("categories.deleted")),Mt()}catch(n){n.status===409?y(t("categories.hasProducts")):f(n)}}async function sa(e){var n;_(t("inventory.title")),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("inventory.title")}</h1>
      <button class="btn btn-primary" id="adjust-btn">⚖ ${t("inventory.adjust")}</button>
    </div>

    <!-- Tabs -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border);">
      <button class="btn btn-primary inv-tab" data-tab="movements">${t("inventory.movements")}</button>
      <button class="btn btn-ghost inv-tab" data-tab="lowstock">⚠ ${t("inventory.lowStock")}</button>
      <button class="btn btn-ghost inv-tab" data-tab="summary">📊 ${t("inventory.summary")}</button>
    </div>

    <div id="inv-output"><div class="loading-spinner"><div class="spinner"></div></div></div>
  `;const s=async a=>{document.querySelectorAll(".inv-tab").forEach(r=>{r.className=r.dataset.tab===a?"btn btn-primary inv-tab":"btn btn-ghost inv-tab"});const o=document.getElementById("inv-output");if(o){o.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>';try{a==="movements"&&await na(o),a==="lowstock"&&await oa(o),a==="summary"&&await ra(o)}catch(r){f(r)}}};document.querySelectorAll(".inv-tab").forEach(a=>a.addEventListener("click",()=>s(a.dataset.tab))),await s("movements"),(n=document.getElementById("adjust-btn"))==null||n.addEventListener("click",()=>re())}async function na(e){const{movements:s,total:n}=await xt.movements({limit:100});if(!s.length){e.innerHTML=`<div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-title">${t("app.noData")}</div></div>`;return}e.innerHTML=`
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("app.date")}</th>
          <th>${t("inventory.product")}</th>
          <th>${t("inventory.movementType")}</th>
          <th class="text-right">${t("inventory.qty")}</th>
          <th class="text-right">${t("inventory.balanceAfter")}</th>
          <th>${t("inventory.reference")}</th>
          <th>${t("users.fullName")}</th>
        </tr></thead>
        <tbody>
          ${s.map(a=>`
            <tr>
              <td style="font-size:0.8rem;">${Bt(a.created_at)}</td>
              <td>
                <div style="font-weight:500;">${a.product_name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${a.sku||""}</div>
              </td>
              <td><span class="badge ${a.movement_type.includes("in")||a.movement_type==="purchase"?"badge-success":a.movement_type==="sale"?"badge-info":"badge-warning"}">
                ${t(`inventory.movementTypes.${a.movement_type}`)||a.movement_type}
              </span></td>
              <td class="text-right">
                <span class="${parseFloat(a.qty)>0?"text-success":"text-danger"}" style="font-weight:600;">
                  ${parseFloat(a.qty)>0?"+":""}${a.qty} ${a.unit}
                </span>
              </td>
              <td class="text-right">${a.balance_after} ${a.unit}</td>
              <td style="font-size:0.8rem; color:var(--text-muted);">${a.reference_type} ${a.notes?`· ${a.notes}`:""}</td>
              <td style="font-size:0.8rem; color:var(--text-muted);">${a.created_by_name||"—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}async function oa(e){const{products:s,count:n}=await xt.lowStock();if(!s.length){e.innerHTML='<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title" style="color:var(--color-success);">All stock levels are adequate</div></div>';return}e.innerHTML=`
    <div style="background:var(--color-warning-light); border:1px solid var(--color-warning); border-radius:0.5rem; padding:0.75rem; margin-bottom:1rem; color:#92400e; font-weight:500;">
      ⚠️ ${t("dashboard.lowStockItems").replace("{n}",n)}
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("products.name")}</th>
          <th>${t("products.category")}</th>
          <th class="text-right">${t("inventory.qty")}</th>
          <th class="text-right">${t("products.lowStockAlert")}</th>
          <th>${t("app.actions")}</th>
        </tr></thead>
        <tbody>
          ${s.map(a=>`
            <tr>
              <td>
                <div style="font-weight:500;">${a.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${a.sku||""}</div>
              </td>
              <td>${a.category_name||"—"}</td>
              <td class="text-right"><span class="text-warning font-semibold">${a.current_stock} ${a.unit}</span></td>
              <td class="text-right text-muted">${a.low_stock_alert} ${a.unit}</td>
              <td>
                <button class="btn btn-sm btn-success adj-btn" data-id="${a.id}" data-name="${a.name}">+ ${t("inventory.adjustIn")}</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `,e.querySelectorAll(".adj-btn").forEach(a=>a.addEventListener("click",()=>re(a.dataset.id,a.dataset.name)))}async function ra(e){const{products:s,totals:n}=await xt.summary();e.innerHTML=`
    <div class="stats-grid" style="margin-bottom:1.5rem; grid-template-columns:repeat(2,1fr);">
      <div class="stat-card" style="--card-accent:#6366f1;"><div class="stat-label">${t("inventory.costValue")}</div><div class="stat-value">${c(n.stock_value_cost)}</div></div>
      <div class="stat-card" style="--card-accent:#10b981;"><div class="stat-label">${t("inventory.retailValue")}</div><div class="stat-value">${c(n.stock_value_retail)}</div></div>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("products.name")}</th>
          <th>${t("products.category")}</th>
          <th class="text-right">${t("inventory.qty")}</th>
          <th class="text-right">${t("products.purchaseCost")}</th>
          <th class="text-right">${t("products.retailPrice")}</th>
          <th class="text-right">${t("inventory.costValue")}</th>
          <th class="text-right">${t("inventory.retailValue")}</th>
        </tr></thead>
        <tbody>
          ${s.map(a=>`
            <tr>
              <td><div style="font-weight:500;">${a.name}</div></td>
              <td>${a.category_name||"—"}</td>
              <td class="text-right">${a.current_stock} ${a.unit}</td>
              <td class="text-right amount">${c(a.purchase_cost)}</td>
              <td class="text-right amount">${c(a.retail_price)}</td>
              <td class="text-right amount">${c(a.stock_value_cost)}</td>
              <td class="text-right amount positive">${c(a.stock_value_retail)}</td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-right" style="font-weight:700;">Total</td>
            <td class="text-right amount" style="font-weight:700;">${c(n.stock_value_cost)}</td>
            <td class="text-right amount positive" style="font-weight:700;">${c(n.stock_value_retail)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `}async function re(e=null,s=""){let n=[];try{n=(await O.list({limit:500})).products}catch{}const a=document.createElement("form");a.innerHTML=`
    <div class="form-group">
      <label class="form-label">${t("inventory.product")} *</label>
      <select name="product_id" class="form-control" required ${e?"disabled":""}>
        <option value="">${t("app.selectOption")}</option>
        ${n.map(o=>`<option value="${o.id}" ${o.id===e?"selected":""}>${o.name} — ${t("app.balance")}: ${o.current_stock} ${o.unit}</option>`).join("")}
        ${e&&!n.find(o=>o.id===e)?`<option value="${e}" selected>${s}</option>`:""}
      </select>
      ${e?`<input type="hidden" name="product_id" value="${e}" />`:""}
    </div>
    <div class="form-group">
      <label class="form-label">${t("inventory.movementType")} *</label>
      <div style="display:flex; gap:0.5rem;">
        <label class="form-check" style="flex:1; padding:0.75rem; background:var(--bg-base); border:1px solid var(--border); border-radius:0.5rem; cursor:pointer;">
          <input type="radio" name="adjustment_type" value="adjustment_in" checked />
          <span>↑ ${t("inventory.adjustIn")}</span>
        </label>
        <label class="form-check" style="flex:1; padding:0.75rem; background:var(--bg-base); border:1px solid var(--border); border-radius:0.5rem; cursor:pointer;">
          <input type="radio" name="adjustment_type" value="adjustment_out" />
          <span>↓ ${t("inventory.adjustOut")}</span>
        </label>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">${t("inventory.qty")} *</label>
      <input name="qty" type="number" min="0.001" step="0.001" class="form-control" required />
    </div>
    <div class="form-group">
      <label class="form-label">${t("inventory.reason")}</label>
      <textarea name="notes" class="form-control" rows="2"></textarea>
    </div>
  `,w({title:t("inventory.adjust"),body:a,size:"md",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:o})=>o()},{label:t("app.confirm"),class:"btn-primary",action:async({close:o})=>{const r=Object.fromEntries(new FormData(a));if(!r.product_id||!r.qty){y("Product and quantity are required");return}try{await xt.adjust(r),$(t("inventory.adjustSuccess")),o()}catch(i){y(i.message)}}}]})}let S="customers",z=1,I={start_date:"",end_date:"",entity_id:""};async function kt(e,s={}){const n=window.location.hash,a=n.includes("/suppliers"),o=n.includes("/new");S=a?"suppliers":"customers",z=1,I={start_date:"",end_date:"",entity_id:""};const r=t(S==="customers"?"payments.customerTitle":"payments.supplierTitle");_(r),new Date().toISOString().slice(0,10),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title" id="payments-page-title">${r}</h1>
      <button class="btn btn-primary" id="add-payment-btn">
        + ${t(S==="customers"?"payments.receivePayment":"payments.makePayment")}
      </button>
    </div>

    <!-- Tabs -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border);">
      <button class="btn ${S==="customers"?"btn-primary":"btn-ghost"} pay-tab" data-type="customers">
        💰 ${t("payments.customerTitle")}
      </button>
      <button class="btn ${S==="suppliers"?"btn-primary":"btn-ghost"} pay-tab" data-type="suppliers">
        💸 ${t("payments.supplierTitle")}
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <input type="date" id="pay-from" class="form-control" style="max-width:160px;" placeholder="From Date" />
      <input type="date" id="pay-to" class="form-control" style="max-width:160px;" placeholder="To Date" />
      <select id="pay-entity-filter" class="form-control" style="max-width:220px;">
        <option value="">${t(S==="customers"?"payments.customer":"payments.supplier")} (${t("app.all")})</option>
      </select>
      <button class="btn btn-secondary btn-sm" id="pay-filter-reset">${t("app.reset")}</button>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>${t("payments.paymentDate")}</th>
            <th>${t("sales.invoiceNo")}</th>
            <th>${t(S==="customers"?"payments.customer":"payments.supplier")}</th>
            <th>${t("payments.account")}</th>
            <th>${t("payments.method")}</th>
            <th>${t("payments.reference")}</th>
            <th class="text-right">${t("payments.amount")}</th>
            <th>${t("app.actions")}</th>
          </tr>
        </thead>
        <tbody id="payments-tbody">
          <tr><td colspan="8"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>
        </tbody>
      </table>
      <div class="pagination" id="payments-pagination"></div>
    </div>
  `,await ia(),await U(),la(),o&&ie()}async function ia(){const e=document.getElementById("pay-entity-filter");if(e)try{if(S==="customers"){const n=(await M.list({limit:500})).customers||[];e.innerHTML=`<option value="">${t("payments.customer")} (${t("app.all")})</option>`+n.map(a=>`<option value="${a.id}">${a.name} (${a.phone||"—"})</option>`).join("")}else{const n=(await D.list({limit:500})).suppliers||[];e.innerHTML=`<option value="">${t("payments.supplier")} (${t("app.all")})</option>`+n.map(a=>`<option value="${a.id}">${a.name} (${a.phone||"—"})</option>`).join("")}}catch{}}async function U(){const e=document.getElementById("payments-tbody");e&&(e.innerHTML='<tr><td colspan="8"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>');try{const s={page:z,limit:20};I.start_date&&(s.start_date=I.start_date),I.end_date&&(s.end_date=I.end_date),I.entity_id&&(S==="customers"?s.customer_id=I.entity_id:s.supplier_id=I.entity_id);const n=S==="customers"?await Y.customerList(s):await Y.supplierList(s),a=n.payments||[],o=n.total||0;if(!e)return;if(!a.length){e.innerHTML=`
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">💳</div>
              <div class="empty-state-title">${t("app.noData")}</div>
            </div>
          </td>
        </tr>
      `,F(0,1,20,"payments-pagination",()=>{});return}e.innerHTML=a.map(r=>`
      <tr>
        <td>${L(r.payment_date)}</td>
        <td style="font-family:monospace; font-weight:600; color:var(--primary);">${r.payment_no}</td>
        <td style="font-weight:500;">${r.customer_name||r.supplier_name||"—"}</td>
        <td>${r.account_name||"—"}</td>
        <td><span class="badge badge-outline">${t(`payments.methods.${r.method}`)||r.method}</span></td>
        <td style="font-size:0.85rem; color:var(--text-muted);">${r.reference||"—"}</td>
        <td class="text-right amount font-bold" style="color:${S==="customers"?"var(--success)":"var(--danger)"};">
          ${S==="customers"?"+":"-"}${c(r.amount)}
        </td>
        <td>
          <button class="btn btn-sm btn-ghost view-payment-btn" data-id="${r.id}" title="${t("app.view")}">👁</button>
        </td>
      </tr>
    `).join(""),e.querySelectorAll(".view-payment-btn").forEach(r=>{r.addEventListener("click",()=>{const i=a.find(l=>l.id===parseInt(r.dataset.id));i&&ca(i)})}),F(o,z,20,"payments-pagination",r=>{z=r,U()})}catch(s){f(s)}}function la(){var e,s,n,a,o;document.querySelectorAll(".pay-tab").forEach(r=>{r.addEventListener("click",()=>{const i=r.dataset.type;B(i==="customers"?"/payments/customers":"/payments/suppliers")})}),(e=document.getElementById("add-payment-btn"))==null||e.addEventListener("click",()=>ie()),(s=document.getElementById("pay-from"))==null||s.addEventListener("change",r=>{I.start_date=r.target.value,z=1,U()}),(n=document.getElementById("pay-to"))==null||n.addEventListener("change",r=>{I.end_date=r.target.value,z=1,U()}),(a=document.getElementById("pay-entity-filter"))==null||a.addEventListener("change",r=>{I.entity_id=r.target.value,z=1,U()}),(o=document.getElementById("pay-filter-reset"))==null||o.addEventListener("click",()=>{document.getElementById("pay-from").value="",document.getElementById("pay-to").value="",document.getElementById("pay-entity-filter").value="",I={start_date:"",end_date:"",entity_id:""},z=1,U()})}async function ie(){var r;const e=S==="customers",s=new Date().toISOString().slice(0,10);let n=[],a=[];try{const[i,l]=await Promise.all([e?M.list({limit:500}):D.list({limit:500}),T.list()]);n=e?i.customers||[]:i.suppliers||[],a=l.accounts||[]}catch(i){f(i);return}const o=t(e?"payments.receivePayment":"payments.makePayment");`${t(e?"payments.customer":"payments.supplier")}`,`${t("app.select")}${n.map(i=>`
            <option value="${i.id}" data-balance="${i.balance}">
              ${i.name} (${t("customers.currentDue")}: ${c(i.balance)})
            </option>
          `).join("")}${t("payments.amount")}${t("payments.account")}${a.map(i=>`<option value="${i.id}">${i.name} (${t(`accounts.types.${i.type}`)||i.type})</option>`).join("")}${t("payments.method")}${["cash","bank_transfer","cheque","mobile_banking"].map(i=>`
              <option value="${i}">${t(`payments.methods.${i}`)}</option>
            `).join("")}${t("payments.paymentDate")}${s}${t("payments.reference")}${t("app.notes")}`,w({title:o,buttons:[{label:t("app.cancel"),class:"btn-secondary",action:({close:i})=>i()},{label:o,class:"btn-success",action:async({close:i})=>{const l=document.getElementById("payment-modal-form");if(!l)return;const p=new FormData(l),d=Object.fromEntries(p);if(!d.amount||parseFloat(d.amount)<=0){y("Please enter a valid payment amount");return}if(e&&!d.customer_id){y("Please select a customer");return}if(!e&&!d.supplier_id){y("Please select a supplier");return}if(!d.account_id){y("Please select an account");return}try{e?await Y.customerCreate(d):await Y.supplierCreate(d),$(t("payments.recorded")),i(),U()}catch(u){y(u.message||"Payment recording failed")}}}]}),(r=document.getElementById("modal-pay-entity"))==null||r.addEventListener("change",i=>{const l=i.target.selectedOptions[0],p=l?parseFloat(l.dataset.balance||"0"):0,d=document.getElementById("modal-pay-amount");p>0&&d&&!d.value&&(d.value=p.toFixed(2))})}function ca(e){const s=S==="customers";`${t("app.name")}${t("app.company")}${t(s?"payments.customerTitle":"payments.supplierTitle")}${t("reports.statement")}${t("sales.invoiceNo")}${e.payment_no}${t("payments.paymentDate")}${L(e.payment_date)}${t(s?"payments.customer":"payments.supplier")}${e.customer_name||e.supplier_name}${t("payments.account")}${e.account_name}${t("payments.method")}${t(`payments.methods.${e.method}`)||e.method}${t("payments.reference")}${e.reference||"—"}${t("payments.amount")}${c(e.amount)}`,e.notes&&`${t("app.notes")}${e.notes}`,w({title:`${t("payments.recorded")}: ${e.payment_no}`,buttons:[{label:t("app.cancel"),class:"btn-secondary",action:({close:n})=>n()},{label:`🖨 ${t("pos.printReceipt")}`,class:"btn-primary",action:()=>{const n=document.getElementById("payment-receipt-print");if(!n)return;const a=window.open("","_blank");a.document.write(`
            <html>
              <head><title>Receipt - ${e.payment_no}</title></head>
              <body style="font-family:sans-serif; padding:20px;">
                ${n.innerHTML}
                <script>window.onload = function() { window.print(); window.close(); }<\/script>
              </body>
            </html>
          `),a.document.close()}}]})}let bt=1,at={start_date:"",end_date:""};async function da(e){var n,a;_(t("expenses.title"));const s=new Date().toISOString().slice(0,10);e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("expenses.title")}</h1>
      <button class="btn btn-primary" id="add-expense-btn">+ ${t("expenses.add")}</button>
    </div>
    <div class="filter-bar">
      <input type="date" id="exp-from" class="form-control" style="max-width:160px;" value="${s}" />
      <input type="date" id="exp-to" class="form-control" style="max-width:160px;" value="${s}" />
      <button class="btn btn-secondary" id="exp-filter-btn">🔍 ${t("app.filter")}</button>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("expenses.date")}</th>
          <th>${t("expenses.category")}</th>
          <th>${t("expenses.description")}</th>
          <th>${t("expenses.account")}</th>
          <th class="text-right">${t("expenses.amount")}</th>
        </tr></thead>
        <tbody id="expenses-tbody"><tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
      <div class="pagination" id="expenses-pagination"></div>
    </div>
  `,at.start_date=s,at.end_date=s,await ft(),(n=document.getElementById("exp-filter-btn"))==null||n.addEventListener("click",()=>{var o,r;at.start_date=(o=document.getElementById("exp-from"))==null?void 0:o.value,at.end_date=(r=document.getElementById("exp-to"))==null?void 0:r.value,bt=1,ft()}),(a=document.getElementById("add-expense-btn"))==null||a.addEventListener("click",()=>pa())}async function ft(){const e=document.getElementById("expenses-tbody");e&&(e.innerHTML='<tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>');try{const s={page:bt,limit:50,...at};Object.keys(s).forEach(o=>{s[o]||delete s[o]});const n=await Tt.list(s),a=n.expenses;if(!a.length){e&&(e.innerHTML=`<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">💳</div><div class="empty-state-title">${t("expenses.noExpenses")}</div></div></td></tr>`);return}e&&(e.innerHTML=a.map(o=>`
      <tr>
        <td>${L(o.expense_date)}</td>
        <td>${o.category_name||"—"}</td>
        <td>${o.description||"—"}</td>
        <td>${o.account_name||"—"}</td>
        <td class="text-right amount negative">${c(o.amount)}</td>
      </tr>
    `).join("")),F(n.total,bt,50,"expenses-pagination",o=>{bt=o,ft()})}catch(s){f(s)}}async function pa(){let e=[],s=[];try{const[o,r]=await Promise.all([Tt.categories(),T.list()]);e=o.categories,s=r.accounts.filter(i=>i.type!=="capital")}catch{}const n=new Date().toISOString().slice(0,10),a=document.createElement("form");a.innerHTML=`
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t("expenses.category")} *</label>
        <select name="category_id" class="form-control" required>
          <option value="">${t("app.selectOption")}</option>
          ${e.map(o=>`<option value="${o.id}">${o.name}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${t("expenses.amount")} *</label>
        <input name="amount" type="number" min="0.01" step="0.01" class="form-control" required />
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label class="form-label">${t("expenses.account")} *</label>
        <select name="account_id" class="form-control" required>
          <option value="">${t("app.selectOption")}</option>
          ${s.map(o=>`<option value="${o.id}" ${o.is_default?"selected":""}>${o.name} (${c(o.balance)})</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${t("expenses.date")} *</label>
        <input name="expense_date" type="date" class="form-control" value="${n}" required />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">${t("expenses.description")}</label>
      <textarea name="description" class="form-control" rows="3"></textarea>
    </div>
  `,w({title:t("expenses.add"),body:a,size:"md",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:o})=>o()},{label:t("app.save"),class:"btn-primary",action:async({close:o})=>{const r=Object.fromEntries(new FormData(a));if(!r.category_id||!r.amount||!r.account_id){y("All required fields must be filled");return}try{await Tt.create(r),$(t("expenses.saved")),o(),ft()}catch(i){y(i.message)}}}]})}async function ua(e){var s;_(t("accounts.title")),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("accounts.title")}</h1>
      <button class="btn btn-primary" id="add-account-btn">+ ${t("accounts.add")}</button>
    </div>
    <div id="accounts-content"><div class="loading-spinner"><div class="spinner"></div></div></div>
  `,await ot(),(s=document.getElementById("add-account-btn"))==null||s.addEventListener("click",()=>ga())}async function ot(){const e=document.getElementById("accounts-content");if(e)try{const{accounts:s,totals:n}=await T.list();let a=`
      <div class="stats-grid" style="grid-template-columns:repeat(3,1fr); margin-bottom:1.5rem;">
        <div class="stat-card" style="--card-accent:#10b981;">
          <div class="stat-label">${t("accounts.totalCash")}</div>
          <div class="stat-value">${c(n.cash||0)}</div>
          <div class="stat-icon">💵</div>
        </div>
        <div class="stat-card" style="--card-accent:#0ea5e9;">
          <div class="stat-label">${t("accounts.totalBank")}</div>
          <div class="stat-value">${c(n.bank||0)}</div>
          <div class="stat-icon">🏦</div>
        </div>
        <div class="stat-card" style="--card-accent:#6366f1;">
          <div class="stat-label">${t("accounts.totalAvailable")}</div>
          <div class="stat-value">${c((n.cash||0)+(n.bank||0))}</div>
          <div class="stat-icon">💰</div>
        </div>
      </div>
    `;const o={};s.forEach(r=>{o[r.type]||(o[r.type]=[]),o[r.type].push(r)});for(const[r,i]of Object.entries(o))a+=`
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-size:0.875rem; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.75rem;">
            ${t(`accounts.types.${r}`)}
          </h2>
          <div class="grid-3">
            ${i.map(l=>`
              <div class="stat-card" style="--card-accent:${r==="cash"?"#10b981":r==="bank"?"#0ea5e9":"#6366f1"};">
                <div class="stat-label">${l.name}</div>
                <div class="stat-value">${c(l.balance)}</div>
                <div class="flex gap-2" style="margin-top:0.75rem; flex-wrap:wrap;">
                  <button class="btn btn-sm btn-secondary stmt-btn" data-id="${l.id}" data-name="${l.name}">📋 ${t("accounts.statement")}</button>
                  <button class="btn btn-sm btn-success dep-btn" data-id="${l.id}" data-name="${l.name}">↓ ${t("accounts.deposit")}</button>
                  <button class="btn btn-sm btn-danger wit-btn" data-id="${l.id}" data-name="${l.name}">↑ ${t("accounts.withdraw")}</button>
                  <button class="btn btn-sm btn-secondary trf-btn" data-id="${l.id}" data-name="${l.name}">↔ ${t("accounts.transfer")}</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;e.innerHTML=a,e.querySelectorAll(".stmt-btn").forEach(r=>r.addEventListener("click",()=>ma(r.dataset.id,r.dataset.name))),e.querySelectorAll(".dep-btn").forEach(r=>r.addEventListener("click",()=>va(r.dataset.id,r.dataset.name))),e.querySelectorAll(".wit-btn").forEach(r=>r.addEventListener("click",()=>ba(r.dataset.id,r.dataset.name))),e.querySelectorAll(".trf-btn").forEach(r=>r.addEventListener("click",async()=>{const i=await T.list();ya(r.dataset.id,r.dataset.name,i.accounts.filter(l=>l.id!==r.dataset.id))}))}catch(s){f(s)}}async function ma(e,s){const n=document.createElement("div");n.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>',w({title:`${t("accounts.statement")} — ${s}`,body:n,size:"xl",footer:[{label:t("app.close"),class:"btn-secondary",action:({close:a})=>a()}]});try{const{transactions:a}=await T.statement(e,{limit:100});if(!a.length){n.innerHTML=`<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">${t("app.noData")}</div></div>`;return}n.innerHTML=`<div class="table-wrapper"><table class="table"><thead><tr><th>${t("app.date")}</th><th>Type</th><th>${t("ledger.description")}</th><th class="text-right">${t("ledger.debit")}</th><th class="text-right">${t("ledger.credit")}</th><th class="text-right">${t("app.balance")}</th></tr></thead>
      <tbody>${a.map(o=>`<tr><td style="font-size:0.8rem;">${Bt(o.created_at)}</td><td><span class="badge badge-muted">${t(`accounts.txnTypes.${o.transaction_type}`)||o.transaction_type}</span></td><td style="font-size:0.8rem;">${o.description||"—"}</td><td class="text-right amount ${parseFloat(o.amount)>0?"positive":""}">${parseFloat(o.amount)>0?c(o.amount):"—"}</td><td class="text-right amount ${parseFloat(o.amount)<0?"negative":""}">${parseFloat(o.amount)<0?c(Math.abs(o.amount)):"—"}</td><td class="text-right amount">${c(o.balance_after)}</td></tr>`).join("")}</tbody></table></div>`}catch(a){n.innerHTML=`<p>${a.message}</p>`}}function va(e,s){const n=document.createElement("form");n.innerHTML=`
    <div class="form-group"><label class="form-label">${t("accounts.amount")} *</label><input name="amount" type="number" min="0.01" step="0.01" class="form-control" required /></div>
    <div class="form-group"><label class="form-label">${t("accounts.description")}</label><input name="description" class="form-control" /></div>
  `,w({title:`${t("accounts.deposit")} — ${s}`,body:n,size:"sm",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:a})=>a()},{label:t("accounts.deposit"),class:"btn-success",action:async({close:a})=>{const o=Object.fromEntries(new FormData(n));if(!o.amount){y(t("accounts.amount")+" required");return}try{await T.deposit(e,o),$(t("accounts.deposited")),a(),ot()}catch(r){y(r.message)}}}]})}function ba(e,s){const n=document.createElement("form");n.innerHTML=`
    <div class="form-group"><label class="form-label">${t("accounts.amount")} *</label><input name="amount" type="number" min="0.01" step="0.01" class="form-control" required /></div>
    <div class="form-group"><label class="form-label">${t("accounts.description")}</label><input name="description" class="form-control" /></div>
  `,w({title:`${t("accounts.withdraw")} — ${s}`,body:n,size:"sm",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:a})=>a()},{label:t("accounts.withdraw"),class:"btn-danger",action:async({close:a})=>{const o=Object.fromEntries(new FormData(n));try{await T.withdraw(e,o),$(t("accounts.withdrawn")),a(),ot()}catch(r){y(r.message)}}}]})}function ya(e,s,n){const a=document.createElement("form");a.innerHTML=`
    <div class="form-group"><label class="form-label">${t("accounts.transferTo")} *</label>
      <select name="to_account_id" class="form-control" required>
        <option value="">${t("app.selectOption")}</option>
        ${n.map(o=>`<option value="${o.id}">${o.name} (${c(o.balance)})</option>`).join("")}
      </select>
    </div>
    <div class="form-group"><label class="form-label">${t("accounts.amount")} *</label><input name="amount" type="number" min="0.01" step="0.01" class="form-control" required /></div>
    <div class="form-group"><label class="form-label">${t("app.notes")}</label><input name="notes" class="form-control" /></div>
  `,w({title:`${t("accounts.transfer")} — ${s}`,body:a,size:"sm",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:o})=>o()},{label:t("accounts.transfer"),class:"btn-primary",action:async({close:o})=>{const r=Object.fromEntries(new FormData(a));try{await T.transfer(e,r),$(t("accounts.transferred")),o(),ot()}catch(i){y(i.message)}}}]})}function ga(e){const s=document.createElement("form");s.innerHTML=`
    <div class="form-group"><label class="form-label">${t("accounts.name")} *</label><input name="name" class="form-control" required /></div>
    <div class="form-group"><label class="form-label">${t("accounts.type")} *</label>
      <select name="type" class="form-control" required>
        ${["cash","bank"].map(n=>`<option value="${n}">${t(`accounts.types.${n}`)}</option>`).join("")}
      </select>
    </div>
    <div class="form-group"><label class="form-label">Opening Balance</label><input name="opening_balance" type="number" min="0" step="0.01" class="form-control" value="0" /></div>
  `,w({title:t("accounts.add"),body:s,size:"sm",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:n})=>n()},{label:t("app.save"),class:"btn-primary",action:async({close:n})=>{const a=Object.fromEntries(new FormData(s));try{await T.create(a),$(t("accounts.saved")),n(),ot()}catch(o){y(o.message)}}}]})}async function ha(e){var o;_(t("reports.title"));const s=new Date().toISOString().slice(0,10),n=s.slice(0,7)+"-01";e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("reports.title")}</h1>
    </div>

    <!-- Report tabs -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border); padding-bottom:0;">
      <button class="btn btn-primary report-tab" data-tab="pl" style="border-bottom-left-radius:0; border-bottom-right-radius:0;">${t("reports.profitLoss")}</button>
      <button class="btn btn-ghost report-tab" data-tab="sales">${t("reports.salesReport")}</button>
      <button class="btn btn-ghost report-tab" data-tab="purchases">${t("reports.purchaseReport")}</button>
    </div>

    <!-- Date controls -->
    <div class="filter-bar" style="margin-bottom:1.5rem;">
      <label class="form-label" style="margin:0; white-space:nowrap;">${t("reports.dateRange")}:</label>
      <input type="date" id="report-from" class="form-control" style="max-width:160px;" value="${n}" />
      <input type="date" id="report-to" class="form-control" style="max-width:160px;" value="${s}" />
      <button class="btn btn-primary" id="generate-btn">📊 ${t("reports.generate")}</button>
    </div>

    <div id="report-output">
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <div class="empty-state-title">${t("reports.generate")}</div>
        <div class="empty-state-text">Select a date range and click Generate Report</div>
      </div>
    </div>
  `;let a="pl";document.querySelectorAll(".report-tab").forEach(r=>{r.addEventListener("click",()=>{a=r.dataset.tab,document.querySelectorAll(".report-tab").forEach(i=>{i.className=i.dataset.tab===a?"btn btn-primary report-tab":"btn btn-ghost report-tab"})})}),(o=document.getElementById("generate-btn"))==null||o.addEventListener("click",async()=>{var p,d;const r=(p=document.getElementById("report-from"))==null?void 0:p.value,i=(d=document.getElementById("report-to"))==null?void 0:d.value,l=document.getElementById("report-output");if(l){l.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>';try{if(a==="pl"){const u=await ct.profitLoss({start_date:r,end_date:i});fa(l,u,r,i)}else if(a==="sales"){const u=await ct.sales({start_date:r,end_date:i});$a(l,u)}else{const u=await ct.purchases({start_date:r,end_date:i});wa(l,u)}}catch(u){f(u),l.innerHTML=`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">${u.message}</div></div>`}}})}function fa(e,s,n,a){const{income:o,cogs:r,gross_profit:i,gross_margin_pct:l,expenses:p,net_profit:d,net_margin_pct:u}=s,m=d>=0;e.innerHTML=`
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header"><span class="card-title">${t("reports.profitLoss")}: ${L(n)} — ${L(a)}</span></div>

      <!-- Key metrics -->
      <div class="stats-grid" style="margin-bottom:1.5rem;">
        <div class="stat-card" style="--card-accent:#6366f1;"><div class="stat-label">${t("reports.totalSales")}</div><div class="stat-value">${c(o.total_sales)}</div><div class="stat-sub">${o.sale_count} ${t("nav.sales").toLowerCase()}</div></div>
        <div class="stat-card" style="--card-accent:#f59e0b;"><div class="stat-label">${t("reports.totalPurchases")}</div><div class="stat-value">${c(r.total_purchases)}</div><div class="stat-sub">${r.purchase_count} ${t("nav.purchases").toLowerCase()}</div></div>
        <div class="stat-card" style="--card-accent:#0ea5e9;"><div class="stat-label">${t("reports.grossProfit")}</div><div class="stat-value" style="color:${parseFloat(i)>=0?"var(--color-success)":"var(--color-danger)"};">${c(i)}</div><div class="stat-sub">${t("reports.grossMargin")}: ${l}%</div></div>
        <div class="stat-card" style="--card-accent:#ef4444;"><div class="stat-label">${t("reports.totalExpenses")}</div><div class="stat-value" style="color:var(--color-danger);">${c(p.total)}</div></div>
        <div class="stat-card" style="--card-accent:${m?"#10b981":"#ef4444"};">
          <div class="stat-label">${t("reports.netProfit")}</div>
          <div class="stat-value" style="color:${m?"var(--color-success)":"var(--color-danger)"};">${c(d)}</div>
          <div class="stat-sub">${t("reports.netMargin")}: ${u}%</div>
        </div>
      </div>

      <!-- Expense breakdown -->
      ${p.by_category.length>0?`
      <div>
        <div style="font-size:0.875rem; font-weight:600; margin-bottom:0.75rem; color:var(--text-secondary);">${t("reports.expensesByCategory")}</div>
        <div class="table-wrapper"><table class="table"><thead><tr><th>${t("expenses.category")}</th><th class="text-right">${t("expenses.amount")}</th><th class="text-right">%</th></tr></thead>
          <tbody>${p.by_category.map(b=>`<tr><td>${b.category}</td><td class="text-right amount">${c(b.amount)}</td><td class="text-right text-muted" style="font-size:0.8rem;">${p.total>0?(b.amount/p.total*100).toFixed(1):0}%</td></tr>`).join("")}</tbody>
        </table></div>
      </div>`:""}
    </div>
  `}function $a(e,s){const{summary:n,products:a}=s,o=n.reduce((r,i)=>r+parseFloat(i.total_sales||0),0);e.innerHTML=`
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-header"><span class="card-title">${t("reports.salesReport")}</span><span style="font-weight:700; color:var(--color-primary);">${c(o)}</span></div>
      <div class="table-wrapper"><table class="table"><thead><tr><th>${t("sales.date")}</th><th>${t("sales.type")}</th><th class="text-right">Count</th><th class="text-right">${t("app.total")}</th><th class="text-right">${t("app.paid")}</th><th class="text-right">${t("app.due")}</th></tr></thead>
        <tbody>${n.map(r=>`<tr><td>${L(r.period)}</td><td><span class="badge ${r.sale_type==="cash"?"badge-success":"badge-warning"}">${t(`sales.types.${r.sale_type}`)}</span></td><td class="text-right">${r.sale_count}</td><td class="text-right amount">${c(r.total_sales)}</td><td class="text-right amount positive">${c(r.total_paid)}</td><td class="text-right amount negative">${c(r.total_due)}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>
    ${a.length>0?`
    <div class="card">
      <div class="card-header"><span class="card-title">Top Products</span></div>
      <div class="table-wrapper"><table class="table"><thead><tr><th>${t("products.name")}</th><th>${t("products.sku")}</th><th class="text-right">Qty Sold</th><th class="text-right">${t("app.total")}</th></tr></thead>
        <tbody>${a.slice(0,20).map(r=>`<tr><td>${r.product_name}</td><td style="font-size:0.8rem; color:var(--text-muted);">${r.sku||"—"}</td><td class="text-right">${r.total_qty} ${r.unit}</td><td class="text-right amount">${c(r.total_amount)}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>`:""}
  `}function wa(e,s){const{summary:n,by_supplier:a}=s,o=n.reduce((r,i)=>r+parseFloat(i.total_purchases||0),0);e.innerHTML=`
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-header"><span class="card-title">${t("reports.purchaseReport")}</span><span style="font-weight:700; color:var(--color-primary);">${c(o)}</span></div>
      <div class="table-wrapper"><table class="table"><thead><tr><th>${t("purchases.date")}</th><th class="text-right">Count</th><th class="text-right">${t("app.total")}</th><th class="text-right">${t("app.paid")}</th><th class="text-right">${t("app.due")}</th></tr></thead>
        <tbody>${n.map(r=>`<tr><td>${L(r.period)}</td><td class="text-right">${r.purchase_count}</td><td class="text-right amount">${c(r.total_purchases)}</td><td class="text-right amount positive">${c(r.total_paid)}</td><td class="text-right amount negative">${c(r.total_due)}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>
    ${a.length>0?`
    <div class="card">
      <div class="card-header"><span class="card-title">By Supplier</span></div>
      <div class="table-wrapper"><table class="table"><thead><tr><th>${t("suppliers.name")}</th><th class="text-right">Count</th><th class="text-right">${t("app.total")}</th></tr></thead>
        <tbody>${a.map(r=>`<tr><td>${r.supplier_name}</td><td class="text-right">${r.purchase_count}</td><td class="text-right amount">${c(r.total_amount)}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>`:""}
  `}async function xa(e){var s;_(t("users.title")),e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">${t("users.title")}</h1>
      <button class="btn btn-primary" id="add-user-btn">+ ${t("users.add")}</button>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead><tr>
          <th>${t("users.fullName")}</th>
          <th>${t("users.username")}</th>
          <th>${t("users.role")}</th>
          <th>${t("users.lastLogin")}</th>
          <th>${t("app.status")}</th>
          <th>${t("app.actions")}</th>
        </tr></thead>
        <tbody id="users-tbody"><tr><td colspan="6"><div class="loading-spinner"><div class="spinner"></div></div></td></tr></tbody>
      </table>
    </div>
  `,await Dt(),(s=document.getElementById("add-user-btn"))==null||s.addEventListener("click",()=>le(null))}async function Dt(){const e=document.getElementById("users-tbody");try{const{users:s}=await K.list();if(!s.length){e&&(e.innerHTML=`<tr><td colspan="6"><div class="empty-state"><div class="empty-state-title">${t("users.noUsers")}</div></div></td></tr>`);return}e&&(e.innerHTML=s.map(n=>`
      <tr>
        <td><div style="font-weight:500;">${n.full_name}</div></td>
        <td style="font-family:monospace; font-size:0.875rem;">${n.username}</td>
        <td>
          <span class="badge ${n.role==="admin"?"badge-danger":n.role==="manager"?"badge-info":"badge-muted"}">
            ${t(`users.roles.${n.role}`)}
          </span>
        </td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${n.last_login?Bt(n.last_login):"—"}</td>
        <td><span class="badge ${n.is_active?"badge-success":"badge-danger"}">${n.is_active?t("app.active"):t("app.inactive")}</span></td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-sm btn-secondary edit-btn" data-id="${n.id}">✏</button>
            <button class="btn btn-sm btn-ghost reset-btn" data-id="${n.id}" title="${t("users.resetPassword")}">🔑</button>
            ${n.is_active?`<button class="btn btn-sm btn-danger deact-btn" data-id="${n.id}">🚫</button>`:""}
          </div>
        </td>
      </tr>
    `).join("")),e==null||e.querySelectorAll(".edit-btn").forEach(n=>n.addEventListener("click",()=>le(n.dataset.id))),e==null||e.querySelectorAll(".reset-btn").forEach(n=>n.addEventListener("click",()=>Ea(n.dataset.id))),e==null||e.querySelectorAll(".deact-btn").forEach(n=>n.addEventListener("click",()=>ka(n.dataset.id)))}catch(s){f(s)}}async function le(e){let s={};if(e)try{s=(await K.get(e)).user}catch(a){f(a);return}const n=document.createElement("form");n.innerHTML=`
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">${t("users.fullName")} *</label><input name="full_name" class="form-control" value="${s.full_name||""}" required /></div>
      <div class="form-group"><label class="form-label">${t("users.username")} *</label><input name="username" class="form-control" value="${s.username||""}" required autocapitalize="none" /></div>
    </div>
    ${e?"":`<div class="form-group"><label class="form-label">${t("users.password")} *</label><input name="password" type="password" class="form-control" required minlength="6" autocomplete="new-password" /></div>`}
    <div class="form-group">
      <label class="form-label">${t("users.role")} *</label>
      <select name="role" class="form-control" required>
        ${["admin","manager","cashier"].map(a=>`
          <option value="${a}" ${s.role===a?"selected":""}>${t(`users.roles.${a}`)} — ${t(`users.roleDescriptions.${a}`)}</option>
        `).join("")}
      </select>
    </div>
    ${e?`<div class="form-check"><input type="checkbox" name="is_active" ${s.is_active?"checked":""} /><label class="form-label" style="margin:0;">${t("app.active")}</label></div>`:""}
  `,w({title:t(e?"users.edit":"users.add"),body:n,size:"md",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:a})=>a()},{label:t("app.save"),class:"btn-primary",action:async({close:a})=>{var r;const o=Object.fromEntries(new FormData(n));e&&(o.is_active=((r=n.querySelector("[name=is_active]"))==null?void 0:r.checked)??!0);try{e?await K.update(e,o):await K.create(o),$(t("users.saved")),a(),Dt()}catch(i){y(i.message)}}}]})}async function Ea(e){const s=document.createElement("form");s.innerHTML=`
    <div class="form-group"><label class="form-label">${t("users.newPassword")} *</label><input name="password" type="password" class="form-control" minlength="6" required autocomplete="new-password" placeholder="Min 6 characters" /></div>
  `,w({title:t("users.resetPassword"),body:s,size:"sm",footer:[{label:t("app.cancel"),class:"btn-secondary",action:({close:n})=>n()},{label:t("users.resetPassword"),class:"btn-primary",action:async({close:n})=>{const{password:a}=Object.fromEntries(new FormData(s));if(!a||a.length<6){y("Password must be at least 6 characters");return}try{await K.resetPassword(e,a),$(t("users.passwordReset")),n()}catch(o){y(o.message)}}}]})}async function ka(e){if(await R({message:t("users.deactivateConfirm"),type:"warning"}))try{await K.update(e,{is_active:!1}),Dt()}catch(n){f(n)}}async function _a(e){_(t("settings.title")),e.innerHTML=`
    <div class="page-header"><h1 class="page-title">${t("settings.title")}</h1></div>
    <div class="loading-spinner"><div class="spinner"></div></div>
  `;try{const{settings:s}=await Qt.get();Sa(e,s)}catch(s){f(s)}}function Sa(e,s){var n,a,o,r,i,l;e.innerHTML=`
    <div class="page-header"><h1 class="page-title">${t("settings.title")}</h1></div>

    <div class="grid-2" style="gap:1.5rem;">
      <!-- Company Info -->
      <div class="card">
        <div class="card-header"><span class="card-title">🏢 ${t("settings.company")}</span></div>
        <form id="company-form">
          <div class="form-group">
            <label class="form-label">${t("settings.companyName")}</label>
            <input name="company_name" class="form-control" value="${s.company_name||""}" />
          </div>
          <div class="form-group">
            <label class="form-label">${t("settings.address")}</label>
            <textarea name="company_address" class="form-control" rows="2">${s.company_address||""}</textarea>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">${t("settings.phone")}</label>
              <input name="company_phone" class="form-control" value="${s.company_phone||""}" />
            </div>
            <div class="form-group">
              <label class="form-label">${t("settings.email")}</label>
              <input name="company_email" type="email" class="form-control" value="${s.company_email||""}" />
            </div>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">${t("settings.currency")}</label>
              <input name="currency_symbol" class="form-control" value="${s.currency_symbol||"৳"}" />
            </div>
            <div class="form-group">
              <label class="form-label">${t("settings.language")}</label>
              <select name="default_language" class="form-control">
                <option value="en" ${s.default_language==="en"?"selected":""}>English</option>
                <option value="bn" ${s.default_language==="bn"?"selected":""}>বাংলা</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">💾 ${t("app.save")}</button>
        </form>
      </div>

      <!-- Password Change -->
      <div class="card">
        <div class="card-header"><span class="card-title">🔑 ${t("auth.changePassword")}</span></div>
        <form id="password-form">
          <div class="form-group">
            <label class="form-label">${t("auth.currentPassword")} *</label>
            <input name="current_password" type="password" class="form-control" required autocomplete="current-password" />
          </div>
          <div class="form-group">
            <label class="form-label">${t("auth.newPassword")} *</label>
            <input name="new_password" type="password" class="form-control" required minlength="6" autocomplete="new-password" placeholder="Min 6 characters" />
          </div>
          <div class="form-group">
            <label class="form-label">${t("auth.confirmPassword")} *</label>
            <input name="confirm_password" type="password" class="form-control" required autocomplete="new-password" />
          </div>
          <button type="submit" class="btn btn-primary">🔑 ${t("auth.changePassword")}</button>
        </form>
      </div>

      <!-- Backup & Restore (Admin only) -->
      ${q.isAdmin()?`
        <div class="card" style="grid-column:1 / -1;">
          <div class="card-header"><span class="card-title">💾 ${t("nav.backup")} & ${t("reports.statement")}</span></div>
          <div style="display:flex; flex-wrap:wrap; gap:1.5rem; align-items:center; justify-content:space-between;">
            <div>
              <p style="margin:0 0 0.5rem 0; color:var(--text-secondary); font-size:0.9rem;">
                Export a full JSON backup of all business records (products, customers, sales, purchases, inventory, accounts).
              </p>
              <button class="btn btn-primary" id="export-backup-btn">
                ⬇ Download JSON Backup
              </button>
            </div>
            <div style="border-left:1px solid var(--border); padding-left:1.5rem;">
              <p style="margin:0 0 0.5rem 0; color:var(--text-secondary); font-size:0.9rem;">
                Restore system data from a previously downloaded JSON backup file.
              </p>
              <label class="btn btn-secondary" style="cursor:pointer; display:inline-block;">
                ⬆ Restore from Backup
                <input type="file" id="import-backup-input" accept=".json" style="display:none;" />
              </label>
            </div>
          </div>
        </div>
      `:""}

      <!-- System Info -->
      <div class="card" style="grid-column:1 / -1;">
        <div class="card-header"><span class="card-title">ℹ System Information</span></div>
        <div class="grid-3" style="gap:1rem;">
          <div>
            <div class="form-label">Application</div>
            <div style="font-weight:600;">${t("app.name")}</div>
          </div>
          <div>
            <div class="form-label">Logged in as</div>
            <div style="font-weight:600;">${(n=q.user)==null?void 0:n.full_name} (${(a=q.user)==null?void 0:a.role})</div>
          </div>
          <div>
            <div class="form-label">Version</div>
            <div style="font-weight:600;">1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  `,(o=document.getElementById("company-form"))==null||o.addEventListener("submit",async p=>{p.preventDefault();const d=Object.fromEntries(new FormData(p.target));try{await Qt.update(d),d.default_language&&d.default_language!==st()&&yt(d.default_language),$(t("settings.saved"))}catch(u){f(u)}}),(r=document.getElementById("password-form"))==null||r.addEventListener("submit",async p=>{p.preventDefault();const d=Object.fromEntries(new FormData(p.target));if(d.new_password!==d.confirm_password){y(t("validation.passwordMismatch"));return}try{await $t.changePassword({current_password:d.current_password,new_password:d.new_password}),$(t("auth.passwordChanged")),p.target.reset()}catch(u){y(u.message)}}),(i=document.getElementById("export-backup-btn"))==null||i.addEventListener("click",async()=>{try{$("Generating backup...");const p=await Ot.export(),d=new Blob([JSON.stringify(p,null,2)],{type:"application/json"}),u=URL.createObjectURL(d),m=document.createElement("a");m.href=u,m.download=`coretrade_backup_${new Date().toISOString().slice(0,10)}.json`,m.click(),URL.revokeObjectURL(u)}catch(p){f(p)}}),(l=document.getElementById("import-backup-input"))==null||l.addEventListener("change",async p=>{var m;const d=(m=p.target.files)==null?void 0:m[0];if(!d)return;if(!await R({title:"Restore Database",message:"Restoring a backup will overwrite current tables with data from the backup file. Are you sure you want to proceed?",type:"danger",confirmLabel:"Restore Database"})){p.target.value="";return}try{const b=await d.text(),h=JSON.parse(b);await Ot.import(h),$("Database restored successfully! Reloading..."),setTimeout(()=>window.location.reload(),1500)}catch(b){y(b.message||"Failed to parse or restore backup")}finally{p.target.value=""}})}const ce=document.getElementById("app");let Wt=!1;function E(e){return async s=>{var a;document.getElementById("page-outlet")||Ee(ce);const n=Se();n&&(n.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>',await e(n,s)),(a=document.getElementById("initial-loader"))==null||a.remove()}}x("/login",async()=>{var e;qt(ce),(e=document.getElementById("initial-loader"))==null||e.remove()});x("/",E(Le));x("/pos",E(Te));x("/sales",E(He));x("/purchases",E(Fe));x("/customers",E(Ve));x("/suppliers",E(Qe));x("/products",E(Me));x("/categories",E(ta));x("/inventory",E(sa));x("/expenses",E(da));x("/accounts",E(ua));x("/reports",E(ha));x("/users",E(xa));x("/settings",E(_a));x("/payments/customers",E(kt));x("/payments/customers/new",E(kt));x("/payments/suppliers",E(kt));x("/payments/suppliers/new",E(kt));de(async()=>{var e;q.isAuthenticated()?E(s=>{s.innerHTML=`
        <div class="empty-state" style="padding:4rem 1rem;">
          <div class="empty-state-icon" style="font-size:3rem;">🔍</div>
          <h2 style="margin:1rem 0 0.5rem 0;">${t("error.notFound")}</h2>
          <p style="color:var(--text-muted); margin-bottom:1.5rem;">The page you are looking for does not exist.</p>
          <button class="btn btn-primary" onclick="location.hash='/'">🏠 Return to Dashboard</button>
        </div>
      `})({}):B("/login"),(e=document.getElementById("initial-loader"))==null||e.remove()});pe(async e=>{if(!Wt){try{const{user:n}=await $t.me();q.user=n}catch{q.user=null}Wt=!0}const s=q.isAuthenticated();return!s&&e!=="/login"?(B("/login"),!1):s&&e==="/login"||e==="/users"&&!q.isAdmin()?(B("/"),!1):!0});ve();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});
