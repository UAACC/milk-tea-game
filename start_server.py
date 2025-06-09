import http.server
import socketserver
import webbrowser
import os
import sys
import socket

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def find_available_port(start_port=3000, max_port=3010):
    for port in range(start_port, max_port + 1):
        if not is_port_in_use(port):
            return port
    return None

def start_server():
    try:
        # 查找可用端口
        port = find_available_port()
        if port is None:
            print("错误：无法找到可用端口")
            return

        print(f"尝试在端口 {port} 启动服务器...")
        
        # 设置处理程序
        handler = http.server.SimpleHTTPRequestHandler
        
        # 创建服务器
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"服务器成功启动在 http://localhost:{port}")
            print("按 Ctrl+C 停止服务器")
            
            # 尝试打开浏览器
            try:
                webbrowser.open(f'http://localhost:{port}')
            except Exception as e:
                print(f"无法自动打开浏览器: {e}")
                print(f"请手动访问: http://localhost:{port}")
            
            # 启动服务器
            httpd.serve_forever()
            
    except Exception as e:
        print(f"启动服务器时出错: {e}")
        print("请确保没有其他程序占用端口，并且您有足够的权限运行服务器")
        return

if __name__ == "__main__":
    print("正在启动服务器...")
    start_server() 