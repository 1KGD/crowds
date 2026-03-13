build:
	wasm-pack build --release

watch:
	cargo-watch -- make

install:
	cargo install wasm-pack
	npm i

install-dev:
	make install
	cargo install cargo-watch