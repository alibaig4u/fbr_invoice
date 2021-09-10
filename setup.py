# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in fbr_invoice/__init__.py
from fbr_invoice import __version__ as version

setup(
	name="fbr_invoice",
	version=version,
	description="Fbr Invoice Return",
	author="swe.mirza.ali@gmail.com",
	author_email="swe.mirza.ali@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
