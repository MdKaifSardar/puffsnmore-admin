import { MdSpaceDashboard, MdOutlineCategory } from "react-icons/md";
import { IoListCircleSharp } from "react-icons/io5";
import { FaTable } from "react-icons/fa";
import { BsPatchPlus } from "react-icons/bs";
import { RiCoupon3Fill } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { FaRegRectangleList, FaUsers } from "react-icons/fa6";
import { ImUsers } from "react-icons/im";

export const navItems = [
  {
    name: "Admin Dashboard",
    icon: <MdSpaceDashboard size={20} />,
    link: "/admin/dashboard",
  },
  {
    name: "Users",
    icon: <ImUsers size={20} />,
    link: "/admin/dashboard/users",
  },
  {
    name: "Admins",
    icon: <ImUsers size={20} />,
    link: "/admin/dashboard/admins",
  },
  // {
  //   name: "Vendors",
  //   icon: <FaUsers size={20} />,
  //   link: "/admin/dashboard/vendors",
  // },
  {
    name: "Coupons",
    icon: <RiCoupon3Fill size={20} />,
    link: "/admin/dashboard/coupons",
  },
  {
    name: "Orders",
    icon: <IoListCircleSharp size={20} />,
    link: "/admin/dashboard/orders",
  },
  {
    name: "All Products",
    icon: <FaTable size={20} />,
    link: "/admin/dashboard/product/all/tabular",
  },
  {
    name: "Create Product",
    icon: <BsPatchPlus size={20} />,
    link: "/admin/dashboard/product/create",
  },
  {
    name: "Categories",
    icon: <MdOutlineCategory size={20} />,
    link: "/admin/dashboard/categories",
  },
  {
    name: "Sub Categories",
    icon: (
      <MdOutlineCategory size={20} style={{ transform: "rotate(180deg)" }} />
    ),
    link: "/admin/dashboard/subCategories",
  },
  // {
  //   name: "Order Analytics",
  //   icon: <VscGraph size={20} />,
  //   link: "/admin/dashboard/analytics/order",
  // },
  {
    name: "Website Banners",
    icon: <FaRegRectangleList size={20} />,
    link: "/admin/dashboard/banners/website",
  },
  // {
  //   name: "App Banners",
  //   icon: <FaRegRectangleList size={20} />,
  //   link: "/admin/dashboard/banners/app",
  // },
  // {
  //   name: "TopBars",
  //   icon: <FaRegRectangleList size={20} />,
  //   link: "/admin/dashboard/topbars",
  // },
  {
    name: "Home Screen Offers",
    icon: <FaRegRectangleList size={20} />,
    link: "/admin/dashboard/homescreenoffers",
  },
  {
    name: "Manage product reviews",
    icon: <FaRegRectangleList size={20} />,
    link: "/admin/dashboard/reviews",
  },
];
