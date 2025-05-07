from dotenv import dotenv_values
from os import listdir, environ

check_local = ".env.local" in listdir()

config = {
    **environ,
    **dotenv_values(".env" + ["", ".local"][check_local]),
}
