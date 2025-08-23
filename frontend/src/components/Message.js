import styles from "./Message.module.css"

const Message = ({ message, type }) => {
  if (!message) return null

  return <div className={`${styles.message} ${styles[type]}`}>{message}</div>
}

export default Message
