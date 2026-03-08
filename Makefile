build:
	wasm-pack build --release

build-dev:
	wasm-pack build --dev

watch:
	cargo-watch -- make build-dev

install:
	cargo install wasm-pack

install-dev:
	make install
	cargo install cargo-watch