export default defineAppConfig({
    ui: {
        button: {
            defaultVariants: {
                variant: 'outline',
                color: 'neutral',
            },
            slots: {
                base: 'cursor-pointer',
            },
            compoundVariants: [
                {
                    color: 'neutral',
                    variant: 'outline',
                    class: 'cursor-pointer flex justify-center px-12 py-3 my-7 border-1 border-black hover:bg-secondary-100 active:shadow-[0px_0px_0_rgba(0,0,0)] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                },
            ],
        },
        navigationMenu: {
            slots: {
                linkLabel: 'text-black',
                linkLeadingIcon: 'text-black!',
            }
        },
        tabs: {
            slots: {
                trigger: 'cursor-pointer'
            }
        },
        accordion: {
            slots: {
                root: 'w-screen md:w-[440px]',
                item: 'cursor-pointer border-2 border-black px-3 w-full border-b-0 last:border-b-2',
            }
        },
    }
});
