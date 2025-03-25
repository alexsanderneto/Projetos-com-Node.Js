import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const registrar = () => {
  const [name, setName] = useState("");
  const [email, setName] = useState("");
  const [senha, setSenha] = useState("");

  const HandleRegistrar = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        name,
        email,
        senha,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export default registrar;
