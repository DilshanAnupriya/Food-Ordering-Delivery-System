import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Edit2, Search, X, ChevronLeft, ChevronRight, RefreshCw, UserPlus, AlertTriangle, Loader } from "lucide-react";

export default function AdminUser() {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState(null);

    // Form states
    const [editForm, setEditForm] = useState({
        username: "",
        fullName: "",
        enabled: true
    });

    const [roleForm, setRoleForm] = useState({
        userId: "",
        roleName: "ROLE_USER"
    });

    const [newUserForm, setNewUserForm] = useState({
        username: "",
        fullName: "",
        password: "",
        email: "",
        roleName: "ROLE_USER"
    });

    const availableRoles = ["ROLE_USER", "ROLE_ADMIN"];

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize, searchText, refresh]);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
            const response = await fetch(
                `/api/v1/users?page=${currentPage}&size=${pageSize}${searchText ? `&searchText=${searchText}` : ""}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();

            if (data && data.data) {
                setUsers(data.data.content);
                setTotalPages(data.data.totalPages);
                setCurrentPage(data.data.currentPage);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditForm({
            username: user.username,
            fullName: user.fullName,
            enabled: user.enabled
        });
        setIsEditModalOpen(true);
    };

    const handleChangeRole = (user) => {
        setSelectedUser(user);
        setRoleForm({
            userId: user.userId,
            roleName: user.roles.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : "ROLE_USER"
        });
        setIsRoleModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const submitEditUser = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/v1/users/${selectedUser.userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            setIsEditModalOpen(false);
            setRefresh(!refresh);
        } catch (err) {
            console.error("Error updating user:", err);
            setError("Failed to update user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const submitChangeRole = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/v1/users/change-role`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(roleForm)
            });

            if (!response.ok) {
                throw new Error("Failed to change user role");
            }

            setIsRoleModalOpen(false);
            setRefresh(!refresh);
        } catch (err) {
            console.error("Error changing user role:", err);
            setError("Failed to change user role. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const submitDeleteUser = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/v1/users/${selectedUser.userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            setIsDeleteModalOpen(false);
            setRefresh(!refresh);
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Failed to delete user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const submitAddUser = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const endpoint = newUserForm.roleName === "ROLE_ADMIN"
                ? "/api/v1/users/admin/create"
                : "/api/v1/users/visitor/register";

            const payload = newUserForm.roleName === "ROLE_ADMIN"
                ? {
                    username: newUserForm.username,
                    fullName: newUserForm.fullName,
                    password: newUserForm.password,
                    email: newUserForm.email
                }
                : {
                    username: newUserForm.username,
                    fullName: newUserForm.fullName,
                    password: newUserForm.password,
                    email: newUserForm.email
                };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to add user");
            }

            setIsAddUserModalOpen(false);
            setNewUserForm({
                username: "",
                fullName: "",
                password: "",
                email: "",
                roleName: "ROLE_USER"
            });
            setRefresh(!refresh);
        } catch (err) {
            console.error("Error adding user:", err);
            setError("Failed to add user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25, stiffness: 400 } }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    // Modal component
    const Modal = ({ isOpen, onClose, title, children }) => (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 w-full max-w-md"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
                        </div>
                        <div className="flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setIsAddUserModalOpen(true)}
                            >
                                <UserPlus size={16} className="mr-2" />
                                Add User
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search users..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => setRefresh(!refresh)}
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Refresh
                        </motion.button>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <motion.div
                        className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        type="button"
                                        className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        onClick={() => setError(null)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Users table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {isLoading && !users.length ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader className="h-10 w-10 text-indigo-500 animate-spin" />
                            <span className="ml-3 text-lg text-gray-500">Loading users...</span>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    <AnimatePresence>
                                        {users.length > 0 ? (
                                            <motion.div
                                                variants={containerVariants}
                                                initial="hidden"
                                                animate="visible"
                                                component="tbody"
                                                className="bg-white divide-y divide-gray-200"
                                            >
                                                {users.map((user) => (
                                                    <motion.tr
                                                        key={user.userId}
                                                        variants={itemVariants}
                                                        whileHover={{ backgroundColor: "#f9fafb" }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{user.username}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {user.roles.includes("ROLE_ADMIN") ? (
                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                      Admin
                                    </span>
                                                                ) : (
                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                      User
                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {user.enabled ? (
                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Active
                                    </span>
                                                                ) : (
                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                      Inactive
                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                                                                    onClick={() => handleEditUser(user)}
                                                                >
                                                                    <Edit2 size={16} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                                    onClick={() => handleChangeRole(user)}
                                                                >
                                                                    <Check size={16} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                                    onClick={() => handleDeleteUser(user)}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </motion.button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    No users found. Try adjusting your search or add a new user.
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 0 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            disabled={currentPage === 0}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${
                                                currentPage === 0
                                                    ? "bg-gray-100 cursor-not-allowed"
                                                    : "bg-white hover:bg-gray-50"
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={currentPage >= totalPages - 1}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${
                                                currentPage >= totalPages - 1
                                                    ? "bg-gray-100 cursor-not-allowed"
                                                    : "bg-white hover:bg-gray-50"
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{users.length ? currentPage * pageSize + 1 : 0}</span> to{" "}
                                                <span className="font-medium">
                          {Math.min((currentPage + 1) * pageSize, users.length ? users.length + currentPage * pageSize : 0)}
                        </span> of{" "}
                                                <span className="font-medium">{users.length ? users.length + currentPage * pageSize : 0}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    disabled={currentPage === 0}
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                                                        currentPage === 0
                                                            ? "cursor-not-allowed"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <ChevronLeft size={18} />
                                                </motion.button>
                                                {[...Array(totalPages).keys()].map((page) => (
                                                    <motion.button
                                                        key={page}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            currentPage === page
                                                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {page + 1}
                                                    </motion.button>
                                                ))}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    disabled={currentPage >= totalPages - 1}
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                                                        currentPage >= totalPages - 1
                                                            ? "cursor-not-allowed"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <ChevronRight size={18} />
                                                </motion.button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Edit User Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit User"
            >
                <div className="pt-4 pb-2">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="enabled" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="enabled"
                            value={editForm.enabled.toString()}
                            onChange={(e) => setEditForm({ ...editForm, enabled: e.target.value === "true" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
                <div className="pt-4 pb-2 flex justify-end gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={submitEditUser}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader size={16} className="animate-spin mr-2" />
                        ) : (
                            <Check size={16} className="mr-2" />
                        )}
                        Save Changes
                    </motion.button>
                </div>
            </Modal>

            {/* Change Role Modal */}
            <Modal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                title="Change User Role"
            >
                <div className="pt-4 pb-2">
                    <div className="mb-4">
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            id="roleName"
                            value={roleForm.roleName}
                            onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            {availableRoles.map((role) => (
                                <option key={role} value={role}>
                                    {role === "ROLE_ADMIN" ? "Admin" : "User"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="pt-4 pb-2 flex justify-end gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setIsRoleModalOpen(false)}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={submitChangeRole}
                        disabled={isLoading}
          >
            {isLoading ? (
              <Loader size={16} className="animate-spin mr-2" />
            ) : (
              <Check size={16} className="mr-2" />
            )}
            Save Changes
          </motion.button>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="pt-4 pb-2">
          <div className="text-sm text-gray-600">
            Are you sure you want to delete user <span className="font-semibold">{selectedUser?.fullName}</span>? This action cannot be undone.
          </div>
        </div>
        <div className="pt-4 pb-2 flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={submitDeleteUser}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader size={16} className="animate-spin mr-2" />
            ) : (
              <Trash2 size={16} className="mr-2" />
            )}
            Delete User
          </motion.button>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User"
      >
        <div className="pt-4 pb-2">
          <div className="mb-4">
            <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="newUsername"
              value={newUserForm.username}
              onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newFullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="newFullName"
              value={newUserForm.fullName}
              onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="newEmail"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newUserForm.password}
              onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newRoleName" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="newRoleName"
              value={newUserForm.roleName}
              onChange={(e) => setNewUserForm({ ...newUserForm, roleName: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role === "ROLE_ADMIN" ? "Admin" : "User"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="pt-4 pb-2 flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsAddUserModalOpen(false)}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={submitAddUser}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader size={16} className="animate-spin mr-2" />
            ) : (
              <UserPlus size={16} className="mr-2" />
            )}
            Add User
          </motion.button>
        </div>
      </Modal>
    </div>
  );
}