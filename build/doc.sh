cd doc
rm -rf _book
gitbook install
gitbook build
cp -R _book/ ../docs/doc/
