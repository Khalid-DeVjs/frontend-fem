"use client"
import React from "react"
import { useState, useEffect } from "react"
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Edit,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
  X,
  PieChart,
  BarChart3,
  ListTodo,
  Eye,
  Trash2Icon,
  Edit2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// Mock data for demonstration
const mockTasks = [
  {
    _id: "1",
    title: "Complete dashboard design",
    description: "Finish the UI design for the task management dashboard",
    status: "In Progress",
    assignedTo: {
      _id: "101",
      name: "John Doe",
    },
    createdBy: {
      _id: "101",
      name: "John Doe",
    },
    createdAt: new Date("2023-04-10"),
  },
  {
    _id: "2",
    title: "API Integration",
    description: "Connect the frontend with backend API endpoints",
    status: "To Do",
    assignedTo: {
      _id: "101",
      name: "John Doe",
    },
    createdBy: {
      _id: "102",
      name: "Jane Smith",
    },
    createdAt: new Date("2023-04-12"),
  },
  {
    _id: "3",
    title: "User Authentication",
    description: "Implement user login and registration functionality",
    status: "Done",
    assignedTo: {
      _id: "103",
      name: "Mike Johnson",
    },
    createdBy: {
      _id: "101",
      name: "John Doe",
    },
    createdAt: new Date("2023-04-08"),
  },
  {
    _id: "4",
    title: "Database Schema Design",
    description: "Design MongoDB schema for tasks and users",
    status: "Done",
    assignedTo: {
      _id: "101",
      name: "John Doe",
    },
    createdBy: {
      _id: "101",
      name: "John Doe",
    },
    createdAt: new Date("2023-04-05"),
  },
  {
    _id: "5",
    title: "Mobile Responsive Design",
    description: "Make the dashboard responsive for mobile devices",
    status: "In Progress",
    assignedTo: {
      _id: "102",
      name: "Jane Smith",
    },
    createdBy: {
      _id: "101",
      name: "John Doe",
    },
    createdAt: new Date("2023-04-14"),
  },
]

const mockUsers = [
  { _id: "101", name: "John Doe" },
  { _id: "102", name: "Jane Smith" },
  { _id: "103", name: "Mike Johnson" },
  { _id: "104", name: "Sarah Williams" },
]

export default function Dashboard() {
  
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState("All")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    assignedTo: "",
  })
  const [user, setUser] = useState(null) // Add this state
  const navigate = useNavigate()


  const [tasks, setTasks] = useState([]); // Start with empty array instead of mockTasks

  // Add this useEffect hook to fetch tasks when user data is available
  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
  
        const response = await fetch('https://backendfem.vercel.app/api/tasks/mytasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
  
        const data = await response.json();
        console.log("My created tasks:", data.data);
        // Set tasks to state or use them as needed
        setTasks(data.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchMyTasks();
  }, [navigate]);






  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')


        const response = await fetch('https://backendfem.vercel.app/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        console.log("user ====" , data.data);
        
        setUser(data.data) // Set user data in state
      } catch (error) {
        console.error('Error fetching user:', error)
        navigate('/') // Redirect to login on error
      }
    }

    fetchUserData()
  }, [navigate])





  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }
  
      // Create task with the logged-in user as creator
      const taskData = {
        ...newTask,
        assignedTo: newTask.assignedTo || user.id, // Use selected user or current user
        createdBy: user._id
      };
  
      const response = await fetch('https://backendfem.vercel.app/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
  
      const createdTask = await response.json();
      
      // Update local state with the new task
      setTasks([createdTask.data, ...tasks]);
      setNewTask({ title: "", description: "", status: "To Do", assignedTo: "" });
      setIsAddTaskOpen(false);
      
    } catch (error) {
      console.error('Error creating task:', error);
      // You might want to show an error message to the user here
    }
  };


  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Filter tasks based on status
  const filteredTasks = filterStatus === "All" ? tasks : tasks.filter((task) => task.status === filterStatus)



  const handleEditTask = (e) => {
    e.preventDefault()
    const updatedTasks = tasks.map((task) => (task._id === currentTask._id ? { ...currentTask } : task))
    setTasks(updatedTasks)
    setIsEditModalOpen(false)
  }

  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((task) => task._id !== currentTask._id)
    setTasks(updatedTasks)
    setIsDeleteModalOpen(false)
  }

  const openEditModal = (task) => {
    setCurrentTask(task)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (task) => {
    setCurrentTask(task)
    setIsDeleteModalOpen(true)
  }

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
    setTasks(updatedTasks)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Done":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-600"
      case "In Progress":
        return "bg-yellow-500"
      case "Done":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }


    // Delete task handler
    const handleDelete = async (taskId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://backendfem.vercel.app/api/tasks/delete/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) throw new Error('Failed to delete task');
  
        // Remove the task from state
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Custom animation styles
  const modalAnimation = {
    opacity: 1,
    transform: "scale(1)",
    transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div
        className={`hidden md:flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">TaskMaster</h1>}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${sidebarCollapsed ? "mx-auto" : ""}`}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Dashboard Section */}
          <div className="py-4">
            {!sidebarCollapsed && (
              <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</h2>
            )}
            <nav className="space-y-1 px-2">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center" : "justify-start"
                } w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "dashboard"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <LayoutDashboard className={`${sidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>
              <button
                onClick={() => setActiveSection("tasks")}
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center" : "justify-start"
                } w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "tasks"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <ListTodo className={`${sidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`} />
                {!sidebarCollapsed && <span>Tasks</span>}
              </button>
            </nav>
          </div>

          {/* Analytics Section */}
          <div className="py-4">
            {!sidebarCollapsed && (
              <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Analytics</h2>
            )}
            <nav className="space-y-1 px-2">
              <button
                onClick={() => setActiveSection("statistics")}
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center" : "justify-start"
                } w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "statistics"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <PieChart className={`${sidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`} />
                {!sidebarCollapsed && <span>Statistics</span>}
              </button>
              <button
                onClick={() => setActiveSection("reports")}
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center" : "justify-start"
                } w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "reports"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <BarChart3 className={`${sidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`} />
                {!sidebarCollapsed && <span>Reports</span>}
              </button>
            </nav>
          </div>

          {/* Settings Section */}
          <div className="py-4">
            {!sidebarCollapsed && (
              <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Settings</h2>
            )}
            <nav className="space-y-1 px-2">
              <button
                onClick={() => setActiveSection("team")}
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center" : "justify-start"
                } w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "team"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Users className={`${sidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`} />
                {!sidebarCollapsed && <span>Team</span>}
              </button>
              <button
                onClick={() => setActiveSection("settings")}
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center" : "justify-start"
                } w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "settings"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Settings className={`${sidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`} />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-gray-700">
            <button
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              } w-full px-3 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors`}
            >
              <LogOut className={`${sidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`} />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex flex-col w-full max-w-xs bg-gray-900 h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
              <h1 className="text-xl font-bold text-white">TaskMaster</h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
              {/* Dashboard Section */}
              <div className="py-4">
                <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</h2>
                <nav className="space-y-1 px-2">
                  <button
                    onClick={() => {
                      setActiveSection("dashboard")
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-start w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "dashboard"
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("tasks")
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-start w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "tasks"
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <ListTodo className="w-5 h-5 mr-3" />
                    <span>Tasks</span>
                  </button>
                </nav>
              </div>

              {/* Analytics Section */}
              <div className="py-4">
                <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Analytics</h2>
                <nav className="space-y-1 px-2">
                  <button
                    onClick={() => {
                      setActiveSection("statistics")
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-start w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "statistics"
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <PieChart className="w-5 h-5 mr-3" />
                    <span>Statistics</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("reports")
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-start w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "reports"
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    <span>Reports</span>
                  </button>
                </nav>
              </div>

              {/* Settings Section */}
              <div className="py-4">
                <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Settings</h2>
                <nav className="space-y-1 px-2">
                  <button
                    onClick={() => {
                      setActiveSection("team")
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-start w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "team"
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>Team</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("settings")
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-start w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "settings"
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    <span>Settings</span>
                  </button>
                </nav>
              </div>

              <div className="mt-auto p-4 border-t border-gray-700">
                <button className="flex items-center justify-start w-full px-3 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 mr-2 text-gray-500 rounded-md md:hidden hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative ml-0 md:ml-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search tasks..."
                className="py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-full sm:w-64"
              />
            </div>
          </div>
          <div className="relative">
  <button className="flex items-center text-sm focus:outline-none">
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
      {user?.name?.charAt(0) || "U"} {/* Show first letter of name */}
    </div>
    <span className="hidden ml-2 text-gray-700 md:block">
      {user?.name || "User"} {/* Show full name */}
    </span>
    <ChevronRight className="hidden w-4 h-4 ml-1 text-gray-500 md:block" />
  </button>
</div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Manage and track your team's tasks</p>
              </div>
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all transform hover:scale-105 flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-1" /> Add New Task
              </button>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">To Do</dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">
                          {tasks.filter((task) => task.status === "To Do").length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{
                        width: `${(tasks.filter((task) => task.status === "To Do").length / tasks.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">
                          {tasks.filter((task) => task.status === "In Progress").length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-yellow-500 h-1.5 rounded-full"
                      style={{
                        width: `${(tasks.filter((task) => task.status === "In Progress").length / tasks.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">
                          {tasks.filter((task) => task.status === "Done").length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{
                        width: `${(tasks.filter((task) => task.status === "Done").length / tasks.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Filters */}
            <div className="mt-8 mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus("All")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    filterStatus === "All"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => setFilterStatus("To Do")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    filterStatus === "To Do"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  To Do
                </button>
                <button
                  onClick={() => setFilterStatus("In Progress")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    filterStatus === "In Progress"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilterStatus("Done")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    filterStatus === "Done"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Task List */}
      {/* Task List */}
      <div className="mt-4 bg-white shadow-sm rounded-xl border border-gray-100">
      <ul className="divide-y divide-gray-200">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">{task.title}</h2>
                    <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{task.description}</div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                        {task.assignedTo?.name?.charAt(0) || "?"}
                      </div>
                      <span className="ml-1.5">{task.assignedTo?.name || "Unassigned"}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <button
                    onClick={() => handleViewDetails(task._id)}
                    className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(task._id)}
                    className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="px-6 py-10 text-center">
            <p className="text-gray-500">No tasks found</p>
          </li>
        )}
      </ul>
    </div>
          </div>
        </main>
      </div>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              aria-hidden="true"
              onClick={() => setIsAddTaskOpen(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              style={modalAnimation}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">Add New Task</h3>
                    <form onSubmit={handleAddTask}>
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                          placeholder="Task title"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          rows={3}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                          placeholder="Task description"
                          required
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          value={newTask.status}
                          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                      <div className="mb-4">
  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
    Assign To
  </label>
  <select
    id="assignedTo"
    value={newTask.assignedTo}
    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
  >
    <option value={user?._id}>Me ({user?.name})</option>
    {mockUsers.filter(u => u._id !== user?._id).map((user) => (
      <option key={user._id} value={user._id}>
        {user.name}
      </option>
    ))}
  </select>
</div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-all transform hover:scale-105"
                        >
                          Add Task
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddTaskOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && currentTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              aria-hidden="true"
              onClick={() => setIsEditModalOpen(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              style={modalAnimation}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">Edit Task</h3>
                    <form onSubmit={handleEditTask}>
                      <div className="mb-4">
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          id="edit-title"
                          value={currentTask.title}
                          onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="edit-description"
                          value={currentTask.description}
                          onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                          rows={3}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                          required
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          id="edit-status"
                          value={currentTask.status}
                          onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                          Assign To
                        </label>
                        <select
                          id="edit-assignedTo"
                          value={currentTask.assignedTo?._id || ""}
                          onChange={(e) => {
                            const selectedUser = mockUsers.find((user) => user._id === e.target.value)
                            setCurrentTask({
                              ...currentTask,
                              assignedTo: selectedUser || null,
                            })
                          }}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
                        >
                          <option value="">Select User</option>
                          {mockUsers.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-all transform hover:scale-105"
                        >
                          Update Task
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditModalOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
      {isDeleteModalOpen && currentTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              aria-hidden="true"
              onClick={() => setIsDeleteModalOpen(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              style={modalAnimation}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-bold text-gray-900">Delete Task</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this task? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteTask}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all transform hover:scale-105"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
