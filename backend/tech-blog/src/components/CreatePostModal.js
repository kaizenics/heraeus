import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/CreatePostModal.scss";
import { AiFillCloseCircle } from "react-icons/ai";
import axios from "axios";

const CreatePostModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!title) newErrors.title = "Title is required.";
    if (!post) newErrors.post = "Description is required.";
    if (!file) newErrors.file = "Image is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("post", post);
      formData.append("image", file);

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/post/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response.data);
        window.location.href = '/main/Home';
        onClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-overlay">
      <div className="modal">
        <div className="post-header">
          <p>Create Blog Post</p>
          <AiFillCloseCircle className="cancel-icon" onClick={onClose} />
        </div>

        <div className="end-5">
          <div></div>
        </div>

        <div className="post-group">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            type="text"
            autoComplete="off"
            placeholder="Title of your blog"
          />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        <div className="end-4">
          <div></div>
        </div>

        <div className="post-group-desc">
          <textarea
            value={post}
            onChange={(event) => setPost(event.target.value)}
            name="post-description"
            placeholder="What's on your mind?"
          />
          {errors.post && (
            <p className="error-text">{errors.post}</p>
          )}
        </div>

        <div className="scroll-image">
          <img src={file && URL.createObjectURL(file)} alt="" />
        </div>

        <div className="upload-image-btn">
          <label htmlFor="fileInput" className="upload-button">
            Upload Image
          </label>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            id="fileInput"
          />
          {errors.file && <p className="error-text">{errors.file}</p>}
        </div>

        <div className="select-post-btn">
          <button className="post-select">Post</button>
        </div>
      </div>
    </form>
  );
};

CreatePostModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CreatePostModal;
