let UpdateFnObj = {
  translate: {
    "X": {
      "fwd": (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return false
        } else if (b == 3 || b == 4) {
          return true
        }
        return null
      },
      "bwd": (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return true
        } else if (b == 3 || b == 4) {
          return false
        }
        return null
      },
      x: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return -1
        } else if (b == 3 || b == 4) {
          return 1
        }
        return null
      },
      y: () => {
        return 1
      },
      z: () => {
        return 1
      }
    },
    "Y": {
      "fwd": (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return false
        } else if (b == 2 || b == 4) {
          return true
        }
        return null
      },
      "bwd": (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return true
        } else if (b == 2 || b == 4) {
          return false
        }
        return null
      },
      x: () => {
        return 1
      },
      y: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return -1
        } else if (b == 2 || b == 4) {
          return 1
        }
        return null
      },
      z: () => {
        return 1
      }
    },
    "Z": {
      "fwd": () => {
        return true
      },
      "bwd": () => {
        return false
      },
      x: () => {
        return 1
      },
      y: () => {
        return 1
      },
      z: () => {
        return 1
      }
    },
    "XY": {
      x: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return -1
        } else if (b == 3 || b == 4) {
          return 1
        }
        return null
      },
      y: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return -1
        } else if (b == 2 || b == 4) {
          return 1
        }
        return null
      },
      z: () => {
        return 1
      }
    },
    "XZ": {
      x: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return -1
        } else if (b == 3 || b == 4) {
          return 1
        }
        return null
      },
      y: () => {
        return 1
      },
      z: () => {
        return 1
      }
    },
    "YZ": {
      x: () => {
        return 1
      },
      y: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return -1
        } else if (b == 2 || b == 4) {
          return 1
        }
        return null
      },
      z: () => {
        return 1
      }
    },
  },
  rotate: {
    'X': {
      'x': (bearing) => {
        return Math.cos(bearing * (Math.PI / 180));
      },
      'y': (bearing) => {
        return 0
      },
      'z': (bearing) => {
        return 0
      },
    },
    'Y': {
      'x': (bearing) => {
        return 0
      },
      'y': (bearing) => {
        return -Math.sin(bearing * (Math.PI / 180));
      },
      'z': (bearing) => {
        return 0
      },
    },
    'Z': {
      'x': (bearing) => {
        return 0
      },
      'y': (bearing) => {
        return 0
      },
      'z': (bearing) => {
        return Math.PI + (90 - bearing) * (Math.PI / 180);
      },
    },
  },
  scale: {
    "X": {
      x: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return -1
        } else if (b == 3 || b == 4) {
          return 1
        }
        return null
      },
      y: () => {
        return 1
      },
      z: () => {
        return 1
      }
    },
    "Y": {
      x: () => {
        return 1
      },
      y: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return -1
        } else if (b == 2 || b == 4) {
          return 1
        }
        return null
      },
      z: () => {
        return 1
      }
    },
    "Z": {
      x: () => {
        return 1
      },
      y: () => {
        return 1
      },
      z: () => {
        return 1
      }
    },
    "XY": {
      x: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return -1
        } else if (b == 3 || b == 4) {
          return 1
        }
        return null
      },
      y: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return -1
        } else if (b == 2 || b == 4) {
          return 1
        }
        return null
      },
      z: () => {
        return 1
      }
    },
    "XZ": {
      x: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return -1
        } else if (b == 3 || b == 4) {
          return 1
        }
        return null
      },
      y: () => {
        return 1
      },
      z: () => {
        return 1
      }
    },
    "YZ": {
      x: () => {
        return 1
      },
      y: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return -1
        } else if (b == 2 || b == 4) {
          return 1
        }
        return null
      },
      z: () => {
        return 1
      }
    },
    "XYZX": {
      x: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 2) {
          return -1
        } else if (b == 3 || b == 4) {
          return 1
        }
        return null
      },
      y: () => {
        return 1
      },
      z: () => {
        return 1
      }
    },
    "XYZY": {
      x: () => {
        return 1
      },
      y: (bearing) => {
        let b = manageBearing(bearing)
        if (b == 1 || b == 3) {
          return -1
        } else if (b == 2 || b == 4) {
          return 1
        }
        return null
      },
      z: () => {
        return 1
      }
    },
    "XYZZ": {
      x: () => {
        return 1
      },
      y: () => {
        return 1
      },
      z: () => {
        return 1
      }
    },
  }
}
let manageBearing = (bearing) => {
  if (bearing >= 0 && bearing < 90) {
    return 1
  } else if (bearing >= 90 && bearing <= 180) {
    return 2
  } else if (bearing < 0 && bearing > -90) {
    return 3
  } else if (bearing <= -90 && bearing > -180) {
    return 4
  }
  return null
}
export default UpdateFnObj