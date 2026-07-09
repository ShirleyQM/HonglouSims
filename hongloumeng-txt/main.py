import requests
from bs4 import BeautifulSoup
import os

def get_all_links(url):
    """获取给定URL页面中的所有子链接"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        return [a.get('href') for a in soup.find_all('a', href=True)]
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return []

def get_text_from_url(url):
    """从给定URL获取<title>和<center>标签内的文本内容"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        response.encoding = 'gb2312'  # 设置正确的编码
        soup = BeautifulSoup(response.text, 'html.parser')
        
        title = soup.title.string if soup.title else "无标题"
        center_content = '\n'.join([center.get_text(strip=True) for center in soup.find_all('center')])
        
        return title, f"{title}\n\n{center_content}"
    except requests.RequestException as e:
        print(f"获取 {url} 时出错: {e}")
        return "错误", ""

def save_text_to_file(text, filename):
    """将文本内容保存到文件，使用utf-8编码"""
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(text)

def main(base_url):
    all_links = get_all_links(base_url)
    if not os.path.exists('output'):
        os.makedirs('output')
    
    for link in all_links:
        if not link.startswith('http'):
            link = base_url + link
        title, text = get_text_from_url(link)
        filename = f"output/{title}.txt"
        save_text_to_file(text, filename)
        print(f"已保存来自 {link} 的文本到 {filename}")

if __name__ == "__main__":
    base_url = 'http://www.purepen.com/hlm/'
    main(base_url)