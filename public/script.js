document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            Swal.fire({
                title: "Delete this post?",
                text: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            });
        })
    })
});