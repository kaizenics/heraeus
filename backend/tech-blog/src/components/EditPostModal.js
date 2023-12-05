import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/EditPostModal.scss";
import { AiFillCloseCircle } from "react-icons/ai";
import axios from "axios";

const EditPostModal = ({ onClose, postId }) => {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/post/${postId}/`);
        const postData = response.data;

        setTitle(postData.title);
        setPost(postData.post);
  
        const imageBlob = await fetch(postData.image).then((res) => res.blob());
        setFile(new File([imageBlob], "image"));
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleInputChange = (event) => {
    setHasChanges(true); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!title) newErrors.title = "Title is required.";
    if (!post) newErrors.post = "Description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("post", post);
      if (file) {
        formData.append("image", file);
      }

      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/post/${postId}/`,
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
    <div className="modal-overlay">
      <div className="modal">
        <div className="post-header">
          <p>Edit Blog Post</p>
          <AiFillCloseCircle className="cancel-icon" onClick={onClose} />
        </div>

        <div className="end-5">
          <div></div>
        </div>

        <div className="post-group">
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              handleInputChange();
            }}
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
            onChange={(event) => {
              setPost(event.target.value);
              handleInputChange();
            }}
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
            Replace Image
          </label>
          <input
            onChange={(e) => {
              setFile(e.target.files[0]);
              handleInputChange();
            }}
            type="file"
            id="fileInput"
          />
          {errors.file && <p className="error-text">{errors.file}</p>}
        </div>

        <div className="select-post-btn">
          <button className="post-select" onClick={handleSubmit} disabled={!hasChanges}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

EditPostModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
};

export default EditPostModal;

