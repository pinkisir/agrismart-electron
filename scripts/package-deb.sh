#!/usr/bin/env bash
set -euo pipefail

APP_NAME="agrismart"
PRODUCT_NAME="AgriSmart"
ARCH="arm64"
OUT_DIR="release"
UNPACKED_DIR="$OUT_DIR/linux-arm64-unpacked"
PKG_ROOT="$OUT_DIR/deb-root"
INSTALL_DIR="$PKG_ROOT/opt/$PRODUCT_NAME"
DEBIAN_DIR="$PKG_ROOT/DEBIAN"
DEB_PATH="$OUT_DIR/${APP_NAME}_$(node -p "require('./package.json').version")_${ARCH}.deb"

VERSION="$(node -p "require('./package.json').version")"
DESCRIPTION="$(node -p "require('./package.json').description || ''")"
HOMEPAGE="$(node -p "require('./package.json').homepage || ''")"
MAINTAINER="$(node -p "const p=require('./package.json'); const a=p.author || 'AgriSmart Team'; typeof a === 'string' ? a : a.name + (a.email ? ' <' + a.email + '>' : '')")"

if [ ! -d "$UNPACKED_DIR" ]; then
  echo "Missing $UNPACKED_DIR. Run electron-builder dir target first." >&2
  exit 1
fi

rm -rf "$PKG_ROOT" "$DEB_PATH"
mkdir -p "$INSTALL_DIR" "$DEBIAN_DIR" "$PKG_ROOT/usr/bin" "$PKG_ROOT/usr/share/applications"
cp -a "$UNPACKED_DIR/." "$INSTALL_DIR/"

EXECUTABLE=""
if [ -x "$INSTALL_DIR/$APP_NAME" ]; then
  EXECUTABLE="$APP_NAME"
elif [ -x "$INSTALL_DIR/$PRODUCT_NAME" ]; then
  EXECUTABLE="$PRODUCT_NAME"
else
  EXECUTABLE="$(find "$INSTALL_DIR" -maxdepth 1 -type f -perm -111 -printf '%f\n' | head -n 1)"
fi

if [ -z "$EXECUTABLE" ]; then
  echo "Cannot find executable in $INSTALL_DIR" >&2
  exit 1
fi

cat > "$PKG_ROOT/usr/bin/$APP_NAME" <<EOF
#!/bin/sh
if [ "\$(id -u)" -eq 0 ]; then
  exec "/opt/$PRODUCT_NAME/$EXECUTABLE" --no-sandbox "\$@"
fi
exec "/opt/$PRODUCT_NAME/$EXECUTABLE" "\$@"
EOF
chmod 755 "$PKG_ROOT/usr/bin/$APP_NAME"

if [ -f "assets/icons/32x32.png" ]; then
  install -Dm644 "assets/icons/32x32.png" "$PKG_ROOT/usr/share/icons/hicolor/32x32/apps/$APP_NAME.png"
fi
if [ -f "assets/icons/128x128.png" ]; then
  install -Dm644 "assets/icons/128x128.png" "$PKG_ROOT/usr/share/icons/hicolor/128x128/apps/$APP_NAME.png"
fi
if [ -f "assets/icons/icon.png" ]; then
  install -Dm644 "assets/icons/icon.png" "$PKG_ROOT/usr/share/pixmaps/$APP_NAME.png"
fi

cat > "$PKG_ROOT/usr/share/applications/$APP_NAME.desktop" <<EOF
[Desktop Entry]
Name=$PRODUCT_NAME
Comment=$DESCRIPTION
Exec=$APP_NAME %U
Terminal=false
Type=Application
Icon=$APP_NAME
Categories=Utility;
StartupWMClass=$PRODUCT_NAME
EOF

INSTALLED_SIZE="$(du -sk "$PKG_ROOT" | cut -f1)"
cat > "$DEBIAN_DIR/control" <<EOF
Package: $APP_NAME
Version: $VERSION
Section: utils
Priority: optional
Architecture: $ARCH
Installed-Size: $INSTALLED_SIZE
Maintainer: $MAINTAINER
Depends: libgtk-3-0, libnotify4, libnss3, libxss1, libxtst6, xdg-utils, libatspi2.0-0, libuuid1, libsecret-1-0, libdrm2, libgbm1
Homepage: $HOMEPAGE
Description: $DESCRIPTION
EOF

cat > "$DEBIAN_DIR/postinst" <<'EOF'
#!/bin/sh
set -e
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database /usr/share/applications || true
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -f -t /usr/share/icons/hicolor || true
fi
exit 0
EOF
chmod 755 "$DEBIAN_DIR/postinst"
chmod 755 "$DEBIAN_DIR"

fakeroot dpkg-deb --build "$PKG_ROOT" "$DEB_PATH"
rm -rf "$PKG_ROOT"
echo "Created $DEB_PATH"
