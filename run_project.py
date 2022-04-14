from multiprocessing import Process
import subprocess
import os


def run_react():
    os.system("start npm run start")


def run_server():
    os.system("start python server.py")


def run_bot():
    os.system("start python shrekksbot.py")


if __name__ == '__main__':
    run_server()
    run_bot()
    run_react()
