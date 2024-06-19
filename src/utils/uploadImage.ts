import axios from "@/axios";

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("/uploads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { fileName, sizes } = response.data;

    return {
      fileName,
      sizes,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default uploadImage;
