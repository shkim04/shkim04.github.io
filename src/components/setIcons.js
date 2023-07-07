import React from "react"

import { FaNodeJs } from "@react-icons/all-files/fa/FaNodeJs"
import { FaReact } from "@react-icons/all-files/fa/FaReact"
import { FaPython } from "@react-icons/all-files/fa/FaPython"
import { FaDatabase } from "@react-icons/all-files/fa/FaDatabase"
import { FaLinux } from "@react-icons/all-files/fa/FaLinux"
import { FaCloud } from "@react-icons/all-files/fa/FaCloud"

const SetIcons = ({ iconText }) => {
  let icon

  switch (iconText) {
    case "NodeJS":
      icon = <FaNodeJs />
      break
    case "React":
      icon = <FaReact />
      break
    case "Python":
      icon = <FaPython />
      break
    case "Database":
      icon = <FaDatabase />
      break
    case "Linux":
      icon = <FaLinux />
      break
    case "Cloud":
      icon = <FaCloud />
      break
    default:
      break
  }

  return icon
}

export default SetIcons
