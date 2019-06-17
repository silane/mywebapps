from setuptools import setup, find_packages

setup(
    name="mywebapps",
    version="0.0.1",
    description="My private web application package for raspberrypi server",
    zip_safe=False,
    packages=find_packages(),
    install_requires=["flask>=1", "osudb_parser"],
    include_package_data=True,
    python_requires='>=3.6',
)
