import {
    Button,
    Col,
    Flex,
    Row,
    Card,
    Dropdown,
    Space,
    Modal,
    Input
  } from "antd";
  import {
    PlusCircleIcon,
    ChevronDown,
    Folder
  } from "lucide-react";
  import { useCreateProject } from "../hooks/apis/mutations/useCreateProject";
  import { useNavigate } from "react-router-dom";
  import { UserButton2 } from "@/components/atoms/UserButton/UserButton2";
  import { useState, useEffect } from "react";
  import { getAllProjectsWithTrees } from "@/store/getProjectsStore";
  
  export const CreateProject = () => {
    const { createProjectMutation } = useCreateProject();
    const navigate = useNavigate();
  
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [projectName, setProjectName] = useState("");
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          setLoading(true);
          const projectsData = await getAllProjectsWithTrees();
  
          const extractedProjects = projectsData.map((projectData) => {
            const children = projectData.tree.children || [];
            const folder = children.find(child => child?.name);
            return {
              id: projectData.id,
              name: folder?.name || `Project ${projectData.id}`
            };
          });
  
          setProjects(extractedProjects);
          if (extractedProjects.length > 0) {
            setSelectedProject(extractedProjects[0]);
          }
        } catch (err) {
          console.error("Error loading projects:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProjects();
    }, []);
  
    const showModal = () => setIsModalVisible(true);
  
    const handleModalCancel = () => {
      setIsModalVisible(false);
      setProjectName("");
    };
  
    const handleModalOk = async () => {
      if (!projectName.trim()) return;
  
      try {
        const response = await createProjectMutation({ name: projectName.trim() });
        navigate(`/project/${response.id}`);
      } catch (error) {
        console.error("Error creating project:", error);
      } finally {
        setIsModalVisible(false);
        setProjectName("");
      }
    };
  
    const handleProjectSelect = (project) => {
      setSelectedProject(project);
      navigate(`/project/${project.id}`);
    };
  
    const dropdownItems = {
      items: projects.map((project) => ({
        key: project.id,
        label: (
          <Space>
            <Folder size={16} />
            {project.name}
          </Space>
        ),
        onClick: () => handleProjectSelect(project)
      }))
    };
  
    const ProjectDropdownMenu = (
      <Dropdown
        menu={dropdownItems}
        placement="bottomRight"
        disabled={loading || projects.length === 0}
      >
        <Button style={{ marginRight: "12px" }}>
          <Space>
            {loading ? "Loading..." : (
              <>
                <Folder size={16} />
                {selectedProject?.name || "Projects"}
              </>
            )}
            <ChevronDown size={16} />
          </Space>
        </Button>
      </Dropdown>
    );
  
    return (
      <>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Flex justify="end" align="center" style={{ padding: "8px 16px" }}>
              {ProjectDropdownMenu}
              <UserButton2 />
            </Flex>
          </Col>
  
          <Col span={24}>
            <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
              <Card
                hoverable
                style={{ width: 300, textAlign: "center" }}
                onClick={showModal}
              >
                <Flex vertical gap="middle" align="center">
                  <div className="bg-blue-100 rounded-full p-4">
                    <PlusCircleIcon size={40} className="text-blue-500" />
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "12px 0" }}>
                    Create New Playground
                  </h2>
                  <p style={{ color: "#666", marginBottom: "16px" }}>
                    Start a new project from scratch with our code playground
                  </p>
                  <Button type="primary" size="large">
                    Create Playground
                  </Button>
                </Flex>
              </Card>
            </Flex>
          </Col>
        </Row>
  
        <Modal
          title="Create New Project"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Create"
        >
          <Input
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onPressEnter={handleModalOk}
          />
        </Modal>
      </>
    );
  };
  