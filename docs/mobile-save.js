(function () {
  const canvas = document.getElementById("canvas");
  const buttons = document.querySelectorAll("[data-f]");

  async function saveImage(format) {
    const mime = `image/${format}`;
    const extension = format === "jpeg" ? "jpg" : "png";
    const baseName = typeof name === "string" && name ? name : "image";
    const filename = `${baseName}-pixel.${extension}`;
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, mime, 0.92),
    );

    if (!blob) {
      alert("画像を作成できませんでした。別の画像でお試しください。");
      return;
    }

    const imageFile = new File([blob], filename, { type: mime });

    try {
      if (navigator.canShare?.({ files: [imageFile] })) {
        await navigator.share({
          files: [imageFile],
          title: filename,
        });
        return;
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  buttons.forEach((button) => {
    button.onclick = () => saveImage(button.dataset.f);
  });
})();
