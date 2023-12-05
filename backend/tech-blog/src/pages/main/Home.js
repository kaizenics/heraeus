import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import CreatePostModal from "../../components/CreatePostModal";
import EditPostModal from "../../components/EditPostModal";
import "../../styles/Home.scss";
import { IoMdPhotos } from "react-icons/io";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/post/");
        // Reverse the order of posts to display the latest at the top
        setPosts(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  const deletePost = async (id) => {

    const confirmation = window.confirm("Delete this post?");
    if (!confirmation) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/post/${id}/`);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedPost(null);
    setIsEditOpen(false);
  };

  useEffect(() => {
    document.title = "Home | Heraeus Interactive";

    return () => {
      document.title = "Heraeus Interactive";
    };
  }, []);

  return (
    <>
      <Navbar />

      <section className="home-body">
        <div className="home-container">
          <div className="post-container">
            <div className="create-post-box">
              <div className="post-init">
                <div className="post-box-init" onClick={openCreateModal}>
                  <p>Create a blog post here</p>
                </div>
              </div>
              <div className="end-3">
                <div></div>
              </div>
              <div className="photo-upload-ctn" onClick={openCreateModal}>
                <IoMdPhotos className="photo-icon" />
                <h1>Upload photo</h1>
              </div>
            </div>
          </div>

          {posts.map((post) => (
            <div className="post-container-2" key={post.id}>
              <div className="upload-post-box">
                <h1>{post.title}</h1>

                <div className="end-3">
                  <div></div>
                </div>

                <p>{post.post}</p>

                <img src={post.image} alt="" />

                <div className="edit-btn-sec">
                  <button className="edit-sec" onClick={() => openEditModal(post)}>Edit Post</button>
                  <button className="delete-sec" onClick={() => deletePost(post.id)}>Delete Post</button>
                </div>
              </div>
            </div>
          ))}

        </div>

        {isCreateOpen && <CreatePostModal onClose={closeCreateModal} />}

        {isEditOpen && <EditPostModal postId={selectedPost.id} onClose={closeEditModal} />}
      </section>
    </>
  );
}
