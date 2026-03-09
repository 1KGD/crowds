build:
	wasm-pack build --release

watch:
	cargo-watch -- make

install:
	cargo install wasm-pack

install-dev:
	make install
	cargo install cargo-watch